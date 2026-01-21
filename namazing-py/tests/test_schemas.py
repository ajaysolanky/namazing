"""Tests for Pydantic schemas."""

import pytest
from pydantic import ValidationError

from namazing.schemas.profile import (
    SessionProfile,
    HonorNames,
    Preferences,
    Veto,
)
from namazing.schemas.name_card import (
    NameCard,
    Nickname,
    Popularity,
    NotableBearers,
    SurnameFit,
    SibsetFit,
    Combo,
)
from namazing.schemas.selection import (
    ExpertSelection,
    Finalist,
    NearMiss,
)
from namazing.schemas.result import Report, RunResult
from namazing.schemas.events import (
    ActivityEvent,
    StartEvent,
    LogEvent,
    PartialEvent,
    DoneEvent,
    ResultEvent,
    ErrorEvent,
)


class TestSessionProfile:
    """Tests for SessionProfile schema."""

    def test_minimal_profile(self):
        """Test creating a minimal profile."""
        profile = SessionProfile(raw_brief="Looking for a name")
        assert profile.raw_brief == "Looking for a name"
        assert profile.family is None
        assert profile.preferences is None

    def test_full_profile(self):
        """Test creating a full profile."""
        profile = SessionProfile(
            raw_brief="Full brief text",
            family=HonorNames(
                surname="Smith",
                siblings=["Alice", "Bob"],
                honor_names=["Mary"],
            ),
            preferences=Preferences(
                style_lanes=["classic", "modern"],
                nickname_tolerance="high",
                length_pref="short",
            ),
            themes=["nature", "literary"],
            vetoes=Veto(hard=["John"], soft=["Jane"]),
            region=["US", "UK"],
            target_popularity_band="100-500",
            comments="Some comments",
        )

        assert profile.family.surname == "Smith"
        assert len(profile.family.siblings) == 2
        assert profile.preferences.nickname_tolerance == "high"
        assert len(profile.themes) == 2
        assert len(profile.vetoes.hard) == 1

    def test_invalid_nickname_tolerance(self):
        """Test that invalid nickname_tolerance raises error."""
        with pytest.raises(ValidationError):
            Preferences(nickname_tolerance="invalid")  # type: ignore

    def test_invalid_length_pref(self):
        """Test that invalid length_pref raises error."""
        with pytest.raises(ValidationError):
            Preferences(length_pref="invalid")  # type: ignore


class TestNameCard:
    """Tests for NameCard schema."""

    def test_minimal_card(self):
        """Test creating a minimal name card."""
        card = NameCard(name="Emma", ipa="/EM-a/", syllables=2)
        assert card.name == "Emma"
        assert card.syllables == 2
        assert card.meaning is None

    def test_full_card(self):
        """Test creating a full name card."""
        card = NameCard(
            name="Eleanor",
            ipa="/EL-uh-nor/",
            syllables=3,
            meaning="Bright light",
            origins=["Greek", "French"],
            variants=["Elinor", "Eleanora"],
            nicknames=Nickname(
                intended=["Ellie"],
                likely=["Nora", "Elle"],
                avoid=["Lenny"],
            ),
            popularity=Popularity(
                latest_rank=35,
                peak_rank=10,
                trend_notes="Rising steadily",
            ),
            notable_bearers=NotableBearers(
                positive=["Eleanor Roosevelt"],
                fictional=["Eleanor from Sense and Sensibility"],
            ),
            cultural_notes=["Royal name in England"],
            surname_fit=SurnameFit(
                surname="Smith",
                notes="Good flow",
            ),
            sibset_fit=SibsetFit(
                siblings=["Oliver"],
                notes="Complements well",
            ),
            honor_mapping=["Margaret -> Eleanor"],
            combo_suggestions=[
                Combo(first="Eleanor", middle="Rose", why="Classic pairing")
            ],
        )

        assert card.name == "Eleanor"
        assert len(card.origins) == 2
        assert card.nicknames.intended == ["Ellie"]
        assert card.popularity.latest_rank == 35

    def test_missing_required_fields(self):
        """Test that missing required fields raises error."""
        with pytest.raises(ValidationError):
            NameCard(name="Emma")  # Missing ipa and syllables


class TestExpertSelection:
    """Tests for ExpertSelection schema."""

    def test_valid_selection(self):
        """Test creating a valid selection."""
        selection = ExpertSelection(
            finalists=[
                Finalist(
                    name="Emma",
                    why="Classic and timeless",
                    combo=Combo(first="Emma", middle="Rose", why="Elegant"),
                ),
                Finalist(name="Olivia", why="Popular but refined"),
            ],
            near_misses=[
                NearMiss(name="Charlotte", reason="Already popular in family"),
            ],
        )

        assert len(selection.finalists) == 2
        assert len(selection.near_misses) == 1
        assert selection.finalists[0].combo.middle == "Rose"

    def test_empty_lists(self):
        """Test with empty lists (valid but unusual)."""
        selection = ExpertSelection(finalists=[], near_misses=[])
        assert len(selection.finalists) == 0


class TestRunResult:
    """Tests for RunResult schema."""

    def test_minimal_result(self, sample_profile):
        """Test creating a minimal run result."""
        result = RunResult(
            profile=sample_profile,
            candidates=[
                NameCard(name="Emma", ipa="/EM-a/", syllables=2),
            ],
            selection=ExpertSelection(
                finalists=[Finalist(name="Emma", why="Great name")],
                near_misses=[],
            ),
            report=Report(
                summary="Recommended Emma",
                finalists=[Finalist(name="Emma", why="Great name")],
            ),
        )

        assert result.profile.raw_brief == "Test brief for a girl"
        assert len(result.candidates) == 1


class TestEvents:
    """Tests for event schemas."""

    def test_activity_event(self):
        """Test ActivityEvent."""
        event = ActivityEvent(
            run_id="test-123",
            agent="brief-parser",
            msg="Parsing brief",
        )
        assert event.t == "activity"
        assert event.run_id == "test-123"

    def test_activity_event_with_alias(self):
        """Test ActivityEvent using the alias."""
        event = ActivityEvent(
            runId="test-123",
            agent="brief-parser",
            msg="Parsing brief",
        )
        assert event.run_id == "test-123"

    def test_start_event(self):
        """Test StartEvent."""
        event = StartEvent(
            run_id="test-123",
            agent="researcher",
            name="Emma",
        )
        assert event.t == "start"
        assert event.name == "Emma"

    def test_log_event(self):
        """Test LogEvent."""
        event = LogEvent(
            run_id="test-123",
            agent="generator",
            msg="Fallback to stubs",
        )
        assert event.t == "log"

    def test_partial_event(self):
        """Test PartialEvent."""
        event = PartialEvent(
            run_id="test-123",
            agent="researcher",
            name="Emma",
            field="card",
            value={"name": "Emma", "ipa": "/EM-a/"},
        )
        assert event.t == "partial"
        assert event.field == "card"

    def test_done_event(self):
        """Test DoneEvent."""
        event = DoneEvent(
            run_id="test-123",
            agent="researcher",
            name="Emma",
        )
        assert event.t == "done"

    def test_result_event(self):
        """Test ResultEvent."""
        event = ResultEvent(
            run_id="test-123",
            agent="brief-parser",
            payload={"raw_brief": "Test"},
        )
        assert event.t == "result"

    def test_error_event(self):
        """Test ErrorEvent."""
        event = ErrorEvent(
            run_id="test-123",
            agent="orchestrator",
            msg="Pipeline failed",
        )
        assert event.t == "error"
