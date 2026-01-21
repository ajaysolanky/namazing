"""Tests for popularity tools."""

import pytest
import tempfile
import os
from pathlib import Path

from namazing.tools.popularity import (
    get_popularity,
    clear_cache,
    PopularityResult,
)


@pytest.fixture
def temp_csv(tmp_path: Path):
    """Create a temporary CSV file with test data."""
    csv_content = """year,name,percent,sex
2020,Liam,0.01,boy
2020,Olivia,0.009,girl
2020,Emma,0.008,girl
2019,Liam,0.009,boy
2019,Olivia,0.008,girl
2019,Emma,0.007,girl
"""
    csv_path = tmp_path / "baby-names.csv"
    csv_path.write_text(csv_content)
    return tmp_path


@pytest.fixture(autouse=True)
def reset_cache():
    """Reset the popularity cache before and after each test."""
    clear_cache()
    yield
    clear_cache()


class TestGetPopularity:
    """Tests for get_popularity function."""

    def test_non_us_region(self):
        """Test that non-US regions return appropriate message."""
        result = get_popularity("Emma", region="UK")
        assert result.timeseries is None
        assert "only available for the US" in result.notes

    def test_unknown_name(self, temp_csv: Path, monkeypatch):
        """Test handling of unknown names."""
        monkeypatch.setenv("DATA_DIR", str(temp_csv))
        clear_cache()

        result = get_popularity("Zzzxxx", region="US")
        assert result.timeseries is None
        assert "No popularity data" in result.notes

    def test_known_name(self, temp_csv: Path, monkeypatch):
        """Test loading data for a known name."""
        monkeypatch.setenv("DATA_DIR", str(temp_csv))
        clear_cache()

        result = get_popularity("Emma", region="US")
        assert result.timeseries is not None
        assert len(result.timeseries) == 2  # 2019 and 2020

    def test_timeseries_sorted_by_year(self, temp_csv: Path, monkeypatch):
        """Test that timeseries is sorted by year."""
        monkeypatch.setenv("DATA_DIR", str(temp_csv))
        clear_cache()

        result = get_popularity("Liam", region="US")
        assert result.timeseries is not None
        years = [d.year for d in result.timeseries]
        assert years == sorted(years)

    def test_missing_csv_returns_empty(self, tmp_path: Path, monkeypatch):
        """Test handling of missing CSV file."""
        monkeypatch.setenv("DATA_DIR", str(tmp_path / "nonexistent"))
        clear_cache()

        result = get_popularity("Emma", region="US")
        assert result.timeseries is None


class TestPopularityResult:
    """Tests for PopularityResult dataclass."""

    def test_default_values(self):
        """Test default values."""
        result = PopularityResult()
        assert result.timeseries is None
        assert result.notes == ""

    def test_with_values(self):
        """Test with explicit values."""
        from namazing.tools.popularity import YearData

        result = PopularityResult(
            timeseries=[YearData(year=2020, rank=1, count=1000)],
            notes="Test notes",
        )
        assert len(result.timeseries) == 1
        assert result.notes == "Test notes"
