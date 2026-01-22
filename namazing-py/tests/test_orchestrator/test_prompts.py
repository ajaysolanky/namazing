"""Tests for prompt loading."""

import pytest
from pathlib import Path

from namazing.orchestrator.prompts import (
    load_prompt_segments,
    clear_prompt_cache,
    PromptSegments,
)


@pytest.fixture(autouse=True)
def reset_cache():
    """Reset the prompt cache before and after each test."""
    clear_prompt_cache()
    yield
    clear_prompt_cache()


class TestLoadPromptSegments:
    """Tests for load_prompt_segments function."""

    def test_loads_brief_parser(self):
        """Test loading the brief-parser prompt."""
        segments = load_prompt_segments("brief-parser")

        assert isinstance(segments, PromptSegments)
        assert "free-form family briefs" in segments.system
        assert "SessionProfile JSON" in segments.instruction

    def test_loads_name_generator(self):
        """Test loading the name-generator prompt."""
        segments = load_prompt_segments("name-generator")

        assert "Lane Generator" in segments.system
        assert "40-60 candidate" in segments.instruction

    def test_loads_researcher(self):
        """Test loading the researcher prompt."""
        segments = load_prompt_segments("researcher")

        assert "Name Researcher" in segments.system
        assert "NameCard" in segments.instruction

    def test_loads_expert_selector(self):
        """Test loading the expert-selector prompt."""
        segments = load_prompt_segments("expert-selector")

        assert "baby-naming consultant" in segments.system
        assert "finalists" in segments.instruction

    def test_loads_report_composer(self):
        """Test loading the report-composer prompt."""
        segments = load_prompt_segments("report-composer")

        assert "baby name consultant" in segments.system
        assert "markdown" in segments.instruction

    def test_caching(self):
        """Test that prompts are cached."""
        # First load
        segments1 = load_prompt_segments("brief-parser")
        # Second load should return cached version
        segments2 = load_prompt_segments("brief-parser")

        assert segments1 is segments2

    def test_invalid_slug_raises_error(self):
        """Test that invalid slug raises FileNotFoundError."""
        with pytest.raises(FileNotFoundError):
            load_prompt_segments("nonexistent-prompt")

    def test_clear_cache(self):
        """Test clearing the prompt cache."""
        # Load a prompt
        segments1 = load_prompt_segments("brief-parser")

        # Clear the cache
        clear_prompt_cache()

        # Load again - should be a new object
        segments2 = load_prompt_segments("brief-parser")

        # Content should be same, but different objects
        assert segments1.system == segments2.system
        assert segments1 is not segments2
