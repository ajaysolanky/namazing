"""Tests for the orchestrator service."""

import pytest
import asyncio

from namazing.orchestrator.service import (
    OrchestratorService,
    RunRecord,
    use_stubs,
)
from namazing.schemas.events import Event


@pytest.mark.asyncio
class TestOrchestratorService:
    """Tests for OrchestratorService class."""

    @pytest.fixture
    def service(self):
        """Create a fresh service instance."""
        return OrchestratorService()

    async def test_start_run_creates_record(self, service: OrchestratorService):
        """Test that start_run creates a run record."""
        record = service.start_run("Test brief", "serial")

        assert isinstance(record, RunRecord)
        assert record.brief == "Test brief"
        assert record.mode == "serial"
        assert record.status == "pending"
        assert record.id is not None

    async def test_get_run_returns_record(self, service: OrchestratorService):
        """Test that get_run returns the correct record."""
        record = service.start_run("Test brief")
        retrieved = service.get_run(record.id)

        assert retrieved is record

    def test_get_run_returns_none_for_unknown(
        self, service: OrchestratorService
    ):
        """Test that get_run returns None for unknown ID."""
        result = service.get_run("nonexistent-id")
        assert result is None

    async def test_subscribe_receives_events(self, service: OrchestratorService):
        """Test that subscribers receive events."""
        events: list[Event] = []

        def listener(event: Event) -> None:
            events.append(event)

        record = service.start_run("Test brief")
        service.subscribe(record.id, listener)

        # Wait for some events
        await asyncio.sleep(0.5)

        assert len(events) > 0

    def test_subscribe_raises_for_unknown_run(
        self, service: OrchestratorService
    ):
        """Test that subscribe raises for unknown run ID."""
        with pytest.raises(ValueError):
            service.subscribe("nonexistent-id", lambda e: None)

    async def test_unsubscribe_works(self, service: OrchestratorService):
        """Test that unsubscribe removes the listener."""
        events: list[Event] = []

        def listener(event: Event) -> None:
            events.append(event)

        record = service.start_run("Test brief")
        unsubscribe = service.subscribe(record.id, listener)

        # Wait a bit, then unsubscribe
        await asyncio.sleep(0.2)
        count_before = len(events)
        unsubscribe()

        # Events should stop accumulating (or slow down significantly)
        await asyncio.sleep(0.3)

        # Should not have received many more events
        # (some may still be in flight)
        assert len(events) <= count_before + 5


@pytest.mark.asyncio
class TestOrchestratorPipeline:
    """Integration tests for the full pipeline."""

    @pytest.fixture
    def service(self):
        """Create a fresh service instance."""
        return OrchestratorService()

    async def test_full_pipeline_with_stubs(
        self, service: OrchestratorService, sample_brief: str
    ):
        """Test running the full pipeline with stubs."""
        assert use_stubs(), "Test requires stub mode"

        events: list[Event] = []
        record = service.start_run(sample_brief, "serial")
        service.subscribe(record.id, lambda e: events.append(e))

        # Wait for completion
        for _ in range(50):  # Max 5 seconds
            await asyncio.sleep(0.1)
            current = service.get_run(record.id)
            if current and current.status in ("completed", "failed"):
                break

        current = service.get_run(record.id)
        assert current is not None
        assert current.status == "completed"
        assert current.result is not None

        # Verify result structure
        result = current.result
        assert result.profile is not None
        assert result.profile.raw_brief == sample_brief
        assert len(result.candidates) > 0
        assert len(result.selection.finalists) > 0
        assert result.report.summary is not None

    async def test_pipeline_events_sequence(
        self, service: OrchestratorService
    ):
        """Test that pipeline emits events in expected sequence."""
        events: list[Event] = []
        record = service.start_run("Brief for a girl", "serial")
        service.subscribe(record.id, lambda e: events.append(e))

        # Wait for completion
        for _ in range(50):
            await asyncio.sleep(0.1)
            current = service.get_run(record.id)
            if current and current.status in ("completed", "failed"):
                break

        # Verify we got activity events for each stage
        agents_seen = [e.agent for e in events if e.t == "activity"]
        assert "brief-parser" in agents_seen
        assert "generator" in agents_seen
        assert "expert-selector" in agents_seen
        assert "report-composer" in agents_seen

    async def test_serial_mode_limits_candidates(
        self, service: OrchestratorService
    ):
        """Test that serial mode limits candidate count."""
        record = service.start_run("Brief for testing", "serial")

        # Wait for completion
        for _ in range(50):
            await asyncio.sleep(0.1)
            current = service.get_run(record.id)
            if current and current.status in ("completed", "failed"):
                break

        current = service.get_run(record.id)
        assert current is not None
        assert current.result is not None

        # Serial mode should have at most 24 candidates
        assert len(current.result.candidates) <= 24

    async def test_result_contains_finalists(
        self, service: OrchestratorService
    ):
        """Test that result contains proper finalists."""
        record = service.start_run("Looking for a girl name", "serial")

        # Wait for completion
        for _ in range(50):
            await asyncio.sleep(0.1)
            current = service.get_run(record.id)
            if current and current.status in ("completed", "failed"):
                break

        current = service.get_run(record.id)
        assert current is not None
        assert current.result is not None

        finalists = current.result.selection.finalists
        assert len(finalists) > 0

        # Each finalist should have name and why
        for finalist in finalists:
            assert finalist.name
            assert finalist.why
