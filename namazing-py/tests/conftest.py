"""Pytest configuration and fixtures."""

import pytest


@pytest.fixture(autouse=True)
def clean_env(monkeypatch):
    """Ensure clean environment for each test."""
    # Remove API keys to ensure stub mode
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    monkeypatch.delenv("SERPAPI_KEY", raising=False)
    monkeypatch.delenv("SEARCH_PROVIDER", raising=False)


@pytest.fixture
def sample_brief():
    """Sample brief for testing."""
    return """
    We're looking for names for our daughter.
    Surname: Thompson
    Siblings: Oliver, Charlotte
    Honor names: Margaret, Rose
    We prefer classic, timeless names with 2-3 syllables.
    """


@pytest.fixture
def sample_profile():
    """Sample session profile for testing."""
    from namazing.schemas.profile import (
        SessionProfile,
        HonorNames,
        Preferences,
    )

    return SessionProfile(
        raw_brief="Test brief for a girl",
        family=HonorNames(
            surname="Thompson",
            siblings=["Oliver", "Charlotte"],
            honor_names=["Margaret", "Rose"],
        ),
        preferences=Preferences(
            style_lanes=["traditional feminine", "literary", "nature"],
            length_pref="short-to-medium",
            nickname_tolerance="medium",
        ),
        region=["US"],
    )
