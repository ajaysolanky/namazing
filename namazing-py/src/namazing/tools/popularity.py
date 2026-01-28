"""Popularity data loading and querying."""

import csv
import os
from dataclasses import dataclass
from pathlib import Path


@dataclass
class YearData:
    """Popularity data for a single year."""

    year: int
    rank: int
    count: int


@dataclass
class PopularityResult:
    """Result of a popularity query."""

    timeseries: list[YearData] | None = None
    notes: str = ""


# Module-level cache for popularity data
_popularity_data: dict[str, dict[int, YearData]] | None = None


def _get_csv_path() -> Path:
    """Get the path to the baby names CSV file."""
    # Check DATA_DIR env var first
    data_dir = os.environ.get("DATA_DIR")
    if data_dir:
        return Path(data_dir) / "baby-names.csv"

    # Check GEMINI_TMPDIR for compatibility
    gemini_dir = os.environ.get("GEMINI_TMPDIR")
    if gemini_dir:
        return Path(gemini_dir) / "baby-names.csv"

    # Default to package data directory
    package_dir = Path(__file__).parent.parent.parent.parent
    return package_dir / "data" / "baby-names.csv"


def _load_popularity_data() -> dict[str, dict[int, YearData]]:
    """Load and process the baby names CSV file."""
    global _popularity_data

    if _popularity_data is not None:
        return _popularity_data

    csv_path = _get_csv_path()
    result: dict[str, dict[int, YearData]] = {}

    try:
        with open(csv_path, newline="", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                year_str = row.get("year", "")
                name = row.get("name", "").strip().replace('"', "")
                percent_str = row.get("percent", "")

                if not year_str or not name or not percent_str:
                    continue

                try:
                    year = int(year_str)
                    percent = float(percent_str)
                    # Approximate count based on percent
                    count = int(percent * 100000)

                    if name not in result:
                        result[name] = {}

                    result[name][year] = YearData(year=year, rank=0, count=count)
                except (ValueError, TypeError):
                    continue

        # Calculate ranks per year
        years = set()
        for name_data in result.values():
            years.update(name_data.keys())

        for year in years:
            year_entries = [(name, data[year]) for name, data in result.items() if year in data]
            year_entries.sort(key=lambda x: x[1].count, reverse=True)

            for rank, (name, _) in enumerate(year_entries, start=1):
                result[name][year].rank = rank

    except FileNotFoundError:
        # Return empty data if file not found
        pass

    _popularity_data = result
    return _popularity_data


def get_popularity(name: str, region: str = "US") -> PopularityResult:
    """Get popularity data for a name.

    Args:
        name: The name to look up.
        region: The region for data. Currently only "US" is supported.

    Returns:
        PopularityResult with timeseries data if available.
    """
    if region != "US":
        return PopularityResult(notes="Popularity data is only available for the US.")

    data = _load_popularity_data()
    name_data = data.get(name)

    if not name_data:
        return PopularityResult(notes="No popularity data found for this name.")

    timeseries = sorted(name_data.values(), key=lambda x: x.year)

    return PopularityResult(
        timeseries=timeseries,
        notes="Popularity data is based on the top 1000 names from 1880 to 2009.",
    )


def clear_cache() -> None:
    """Clear the popularity data cache."""
    global _popularity_data
    _popularity_data = None
