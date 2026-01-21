"""Orchestrator service for running the naming pipeline."""

import asyncio
import json
import os
from dataclasses import dataclass, field
from typing import Any, Callable, Literal
from uuid import uuid4

from pydantic import TypeAdapter

from namazing.schemas.profile import SessionProfile
from namazing.schemas.name_card import NameCard
from namazing.schemas.selection import ExpertSelection
from namazing.schemas.result import Report, RunResult
from namazing.schemas.events import (
    Event,
    ActivityEvent,
    StartEvent,
    LogEvent,
    PartialEvent,
    DoneEvent,
    ResultEvent,
    ErrorEvent,
)
from namazing.tools.phonetics import rough_ipa, count_syllables
from namazing.tools.popularity import get_popularity
from namazing.tools.associations import scan_neg_associations
from namazing.orchestrator.llm import run_json_agent, call_llm, extract_json
from namazing.orchestrator.prompts import load_prompt_segments
from namazing.orchestrator.stubs import (
    Candidate,
    stub_profile,
    stub_candidates,
    stub_card,
    stub_selection,
    stub_report,
)
from namazing.orchestrator.concurrency import map_with_concurrency


RunMode = Literal["serial", "parallel"]
RunStatus = Literal["pending", "running", "completed", "failed"]

# Model is configured via LLM_MODEL env var, defaults handled in llm.py

def use_stubs() -> bool:
    """Check if we should use stubs (no API key available)."""
    return not os.environ.get("OPENROUTER_API_KEY")


DEFAULT_REGION = "US"
MAX_SERIAL_NAMES = 24
CONCURRENCY = int(os.environ.get("AGENT_CONCURRENCY", "4"))


# Type adapters for validation
CandidateListAdapter = TypeAdapter(list[dict[str, Any]])


@dataclass
class RunRecord:
    """Record of a pipeline run."""

    id: str
    brief: str
    mode: RunMode
    status: RunStatus = "pending"
    events: list[Event] = field(default_factory=list)
    result: RunResult | None = None
    error: str | None = None
    listeners: list[Callable[[Event], None]] = field(default_factory=list)
    _pending_task: Any = None  # Coroutine when no event loop available


async def _gather_research_tools(name: str, region: str) -> dict[str, Any]:
    """Gather research tool outputs for a name."""
    popularity = get_popularity(name, region)
    associations = await scan_neg_associations(name)

    return {
        "heuristics": {
            "ipaSeed": rough_ipa(name),
            "syllables": count_syllables(name),
        },
        "popularity": {
            "timeseries": [
                {"year": d.year, "rank": d.rank, "count": d.count}
                for d in (popularity.timeseries or [])
            ],
            "notes": popularity.notes,
        },
        "associations": {
            "items": [
                {"label": item.label, "url": item.url}
                for item in associations.items
            ],
            "notes": associations.notes,
        },
    }


class OrchestratorService:
    """Service for managing pipeline runs."""

    def __init__(self) -> None:
        self._runs: dict[str, RunRecord] = {}

    def start_run(self, brief: str, mode: RunMode = "serial") -> RunRecord:
        """Start a new pipeline run.

        Args:
            brief: The client brief text.
            mode: "serial" for limited names, "parallel" for full analysis.

        Returns:
            The created RunRecord.
        """
        run_id = str(uuid4())
        record = RunRecord(
            id=run_id,
            brief=brief,
            mode=mode,
        )
        self._runs[run_id] = record

        # Start execution in background
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(self._execute(record))
        except RuntimeError:
            # No running loop - schedule for later execution
            # This happens in sync contexts; the caller should await execution
            record._pending_task = self._execute(record)

        return record

    def get_run(self, run_id: str) -> RunRecord | None:
        """Get a run record by ID."""
        return self._runs.get(run_id)

    def subscribe(
        self, run_id: str, listener: Callable[[Event], None]
    ) -> Callable[[], None]:
        """Subscribe to events from a run.

        Args:
            run_id: The run ID to subscribe to.
            listener: Callback function for events.

        Returns:
            Unsubscribe function.

        Raises:
            ValueError: If run not found.
        """
        run = self._runs.get(run_id)
        if not run:
            raise ValueError(f"Run {run_id} not found")

        run.listeners.append(listener)

        def unsubscribe() -> None:
            if listener in run.listeners:
                run.listeners.remove(listener)

        return unsubscribe

    def _emit(self, record: RunRecord, event: Event) -> None:
        """Emit an event to all listeners."""
        record.events.append(event)
        for listener in record.listeners:
            try:
                listener(event)
            except Exception:
                pass  # Don't let listener errors break the pipeline

    async def _execute(self, record: RunRecord) -> None:
        """Execute the pipeline stages."""
        record.status = "running"

        try:
            # Stage 1: Parse brief
            profile = await self._run_brief_parser(record, record.brief)

            # Stage 2: Generate candidates
            candidates = await self._run_name_generator(record, profile)

            # Stage 3: Research names
            cards = await self._run_research(record, profile, candidates)

            # Stage 4: Select finalists
            selection = await self._run_expert_selector(record, profile, cards)

            # Stage 5: Compose report
            report = await self._run_report_composer(
                record, profile, cards, selection
            )

            # Assemble final result
            result = RunResult(
                profile=profile,
                candidates=cards,
                selection=selection,
                report=report,
            )

            record.result = result
            record.status = "completed"

            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="report-composer",
                    payload=report.model_dump(),
                ),
            )

        except Exception as e:
            record.status = "failed"
            record.error = str(e)
            self._emit(
                record,
                ErrorEvent(
                    run_id=record.id,
                    agent="orchestrator",
                    msg=str(e),
                ),
            )

    async def _run_brief_parser(
        self, record: RunRecord, brief: str
    ) -> SessionProfile:
        """Stage 1: Parse the client brief into a SessionProfile."""
        self._emit(
            record,
            ActivityEvent(
                run_id=record.id,
                agent="brief-parser",
                msg="parsing brief",
            ),
        )

        if use_stubs():
            await asyncio.sleep(0.15)
            profile = stub_profile(brief)
            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="brief-parser",
                    payload=profile.model_dump(),
                ),
            )
            return profile

        try:
            user_input = f"Client Brief:\n{brief}\n\nRespond with JSON following SessionProfile schema."

            # Use a partial parse, then add raw_brief back
            segments = load_prompt_segments("brief-parser")
            content = f"{segments.instruction}\n\n{user_input}".strip()

            raw = await call_llm(
                model=None,
                system=segments.system,
                messages=[{"role": "user", "content": content}],
                json_mode=True,
                temperature=0.3,
            )

            parsed = extract_json(raw)
            if isinstance(parsed, dict):
                parsed["raw_brief"] = brief

            profile = SessionProfile.model_validate(parsed)

            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="brief-parser",
                    payload=profile.model_dump(),
                ),
            )
            return profile

        except Exception as e:
            self._emit(
                record,
                LogEvent(
                    run_id=record.id,
                    agent="brief-parser",
                    msg=f"Falling back to stubbed profile due to error: {e}",
                ),
            )
            profile = stub_profile(brief)
            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="brief-parser",
                    payload=profile.model_dump(),
                ),
            )
            return profile

    async def _run_name_generator(
        self, record: RunRecord, profile: SessionProfile
    ) -> list[Candidate]:
        """Stage 2: Generate candidate names."""
        self._emit(
            record,
            ActivityEvent(
                run_id=record.id,
                agent="generator",
                msg="creating name lanes",
            ),
        )

        limit = MAX_SERIAL_NAMES if record.mode == "serial" else 80

        if use_stubs():
            await asyncio.sleep(0.15)
            candidates = stub_candidates(profile)[:limit]
            self._emit(
                record,
                PartialEvent(
                    run_id=record.id,
                    agent="generator",
                    field="candidates",
                    value=[
                        {
                            "name": c.name,
                            "lane": c.lane,
                            "rationale": c.rationale,
                            "theme_links": c.theme_links,
                        }
                        for c in candidates
                    ],
                ),
            )
            return candidates

        try:
            user_input = f"SessionProfile JSON:\n{json.dumps(profile.model_dump(), indent=2)}"

            segments = load_prompt_segments("name-generator")
            content = f"{segments.instruction}\n\n{user_input}".strip()

            raw = await call_llm(
                model=None,
                system=segments.system,
                messages=[{"role": "user", "content": content}],
                json_mode=True,
                temperature=0.6,
            )

            parsed = extract_json(raw)
            if not isinstance(parsed, list):
                raise ValueError("Expected array of candidates")

            candidates = [
                Candidate(
                    name=item.get("name", ""),
                    lane=item.get("lane", ""),
                    rationale=item.get("rationale", ""),
                    theme_links=item.get("theme_links", [])
                    if isinstance(item.get("theme_links"), list)
                    else [],
                )
                for item in parsed[:limit]
            ]

            self._emit(
                record,
                PartialEvent(
                    run_id=record.id,
                    agent="generator",
                    field="candidates",
                    value=[
                        {
                            "name": c.name,
                            "lane": c.lane,
                            "rationale": c.rationale,
                            "theme_links": c.theme_links,
                        }
                        for c in candidates
                    ],
                ),
            )
            return candidates

        except Exception as e:
            self._emit(
                record,
                LogEvent(
                    run_id=record.id,
                    agent="generator",
                    msg=f"Falling back to stubbed candidate list due to error: {e}",
                ),
            )
            candidates = stub_candidates(profile)[:limit]
            self._emit(
                record,
                PartialEvent(
                    run_id=record.id,
                    agent="generator",
                    field="candidates",
                    value=[
                        {
                            "name": c.name,
                            "lane": c.lane,
                            "rationale": c.rationale,
                            "theme_links": c.theme_links,
                        }
                        for c in candidates
                    ],
                ),
            )
            return candidates

    async def _run_research(
        self,
        record: RunRecord,
        profile: SessionProfile,
        candidates: list[Candidate],
    ) -> list[NameCard]:
        """Stage 3: Research each candidate name."""
        region = (profile.region[0] if profile.region else DEFAULT_REGION)
        concurrency = CONCURRENCY if record.mode == "parallel" else 1

        async def research_candidate(
            candidate: Candidate, index: int
        ) -> NameCard:
            self._emit(
                record,
                StartEvent(
                    run_id=record.id,
                    agent="researcher",
                    name=candidate.name,
                ),
            )

            if use_stubs():
                await asyncio.sleep(0.12)
                card = stub_card(candidate.name, candidate.lane, profile)
                self._emit(
                    record,
                    PartialEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                        field="card",
                        value=card.model_dump(),
                    ),
                )
                self._emit(
                    record,
                    DoneEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                    ),
                )
                return card

            try:
                tools = await _gather_research_tools(candidate.name, region)
                user_payload = {
                    "sessionProfile": profile.model_dump(),
                    "candidate": {
                        "name": candidate.name,
                        "lane": candidate.lane,
                        "rationale": candidate.rationale,
                        "theme_links": candidate.theme_links,
                    },
                    "tools": tools,
                    "guidance": {
                        "note": "You have access to OpenRouter model browsing. When you need fresh facts, search the web and cite sources conversationally."
                    },
                }

                card = await run_json_agent(
                    prompt_slug="researcher",
                    model=None,
                    user_input=json.dumps(user_payload),
                    schema=NameCard,
                    temperature=0.4,
                )

                self._emit(
                    record,
                    PartialEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                        field="card",
                        value=card.model_dump(),
                    ),
                )
                self._emit(
                    record,
                    DoneEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                    ),
                )
                return card

            except Exception as e:
                error_msg = f"{type(e).__name__}: {str(e)}"
                self._emit(
                    record,
                    LogEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                        msg=f"Researcher fell back to stub data: {error_msg}",
                    ),
                )
                card = stub_card(candidate.name, candidate.lane, profile)
                self._emit(
                    record,
                    PartialEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                        field="card",
                        value=card.model_dump(),
                    ),
                )
                self._emit(
                    record,
                    DoneEvent(
                        run_id=record.id,
                        agent="researcher",
                        name=candidate.name,
                    ),
                )
                return card

        return await map_with_concurrency(
            candidates, concurrency, research_candidate
        )

    async def _run_expert_selector(
        self,
        record: RunRecord,
        profile: SessionProfile,
        cards: list[NameCard],
    ) -> ExpertSelection:
        """Stage 4: Select finalists from researched names."""
        self._emit(
            record,
            ActivityEvent(
                run_id=record.id,
                agent="expert-selector",
                msg="curating finalists",
            ),
        )

        if use_stubs():
            await asyncio.sleep(0.15)
            selection = stub_selection(cards)
            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="expert-selector",
                    payload=selection.model_dump(),
                ),
            )
            return selection

        try:
            payload = {
                "sessionProfile": profile.model_dump(),
                "cards": [c.model_dump() for c in cards],
            }

            selection = await run_json_agent(
                prompt_slug="expert-selector",
                model=None,
                user_input=json.dumps(payload),
                schema=ExpertSelection,
                temperature=0.3,
            )

            # Deduplicate near_misses by name
            seen_names = set()
            unique_misses = []
            for miss in selection.near_misses:
                if miss.name not in seen_names:
                    seen_names.add(miss.name)
                    unique_misses.append(miss)
            selection.near_misses = unique_misses

            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="expert-selector",
                    payload=selection.model_dump(),
                ),
            )
            return selection

        except Exception as e:
            self._emit(
                record,
                LogEvent(
                    run_id=record.id,
                    agent="expert-selector",
                    msg=f"Falling back to stubbed shortlist due to error: {e}",
                ),
            )
            selection = stub_selection(cards)
            self._emit(
                record,
                ResultEvent(
                    run_id=record.id,
                    agent="expert-selector",
                    payload=selection.model_dump(),
                ),
            )
            return selection

    async def _run_report_composer(
        self,
        record: RunRecord,
        profile: SessionProfile,
        cards: list[NameCard],
        selection: ExpertSelection,
    ) -> Report:
        """Stage 5: Compose the final report."""
        self._emit(
            record,
            ActivityEvent(
                run_id=record.id,
                agent="report-composer",
                msg="writing consultation",
            ),
        )

        if use_stubs():
            await asyncio.sleep(0.15)
            return stub_report(profile, selection)

        try:
            payload = {
                "sessionProfile": profile.model_dump(),
                "selection": selection.model_dump(),
                "candidates": [c.model_dump() for c in cards],
            }

            segments = load_prompt_segments("report-composer")
            messages = [
                {
                    "role": "user",
                    "content": f"{segments.instruction}\n\n{json.dumps(payload)}",
                }
            ]

            markdown = await call_llm(
                model=None,
                system=segments.system,
                messages=messages,
                json_mode=False,
                temperature=0.4,
            )

            # Use more of the markdown for the summary instead of just the first line
            summary = markdown.strip()

            combos = [f.combo for f in selection.finalists if f.combo is not None]

            return Report(
                summary=summary,
                loved_names=[],
                finalists=selection.finalists,
                combos=combos,
                tradeoffs=["Review the report for tradeoffs."],
                tie_break_tips=[
                    "Read the report for tie-break tips."
                ],
            )

        except Exception as e:
            self._emit(
                record,
                LogEvent(
                    run_id=record.id,
                    agent="report-composer",
                    msg=f"Falling back to stubbed report due to error: {e}",
                ),
            )
            return stub_report(profile, selection)


# Global singleton instance
orchestrator_service = OrchestratorService()
