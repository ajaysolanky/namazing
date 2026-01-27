"""Cultural name verification tools.

Provides verified meanings for names from specific cultures to prevent
LLM hallucination of etymologies, particularly for CJK (Chinese, Japanese, Korean) names.
"""

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass
class KoreanNameInfo:
    """Verified information about a Korean name."""

    name: str
    hangul: str | None
    meanings: list[str]
    notes: str
    origin: str | None = None
    is_korean: bool = True


# Cache for loaded dictionary
_korean_names_cache: dict[str, dict[str, Any]] | None = None


def _load_korean_names() -> dict[str, dict[str, Any]]:
    """Load the Korean names dictionary from JSON file."""
    global _korean_names_cache

    if _korean_names_cache is not None:
        return _korean_names_cache

    data_path = Path(__file__).parent.parent / "data" / "korean_names.json"

    try:
        with open(data_path, encoding="utf-8") as f:
            data = json.load(f)
            # Remove metadata key
            _korean_names_cache = {
                k: v for k, v in data.items() if not k.startswith("_")
            }
            return _korean_names_cache
    except (FileNotFoundError, json.JSONDecodeError):
        _korean_names_cache = {}
        return _korean_names_cache


def lookup_korean_name(name: str) -> KoreanNameInfo | None:
    """Look up verified Korean name information.

    Args:
        name: The name to look up (case-insensitive).

    Returns:
        KoreanNameInfo if the name is in our verified dictionary, None otherwise.
    """
    korean_names = _load_korean_names()
    normalized = name.strip().lower()

    entry = korean_names.get(normalized)
    if entry is None:
        return None

    origin = entry.get("origin")
    is_korean = origin is None or origin == "Korean"

    return KoreanNameInfo(
        name=name,
        hangul=entry.get("hangul"),
        meanings=entry.get("meanings", []),
        notes=entry.get("notes", ""),
        origin=origin,
        is_korean=is_korean,
    )


def verify_korean_meaning(name: str, claimed_meaning: str) -> tuple[bool, str]:
    """Verify if a claimed Korean meaning is accurate.

    Args:
        name: The name to verify.
        claimed_meaning: The meaning claimed for this name.

    Returns:
        Tuple of (is_verified, explanation).
        - If verified: (True, "Verified: [actual meanings]")
        - If wrong: (False, "Incorrect: [explanation]")
        - If unknown: (False, "Unverified: not in dictionary")
    """
    info = lookup_korean_name(name)

    if info is None:
        return (False, f"Unverified: '{name}' not in Korean names dictionary")

    if not info.is_korean:
        return (
            False,
            f"Incorrect: '{name}' is not Korean. {info.notes}",
        )

    if not info.meanings:
        return (
            False,
            f"Incorrect: '{name}' has no verified Korean meanings. {info.notes}",
        )

    # Check if claimed meaning matches any known meaning
    claimed_lower = claimed_meaning.lower()
    for meaning in info.meanings:
        if meaning.lower() in claimed_lower or claimed_lower in meaning.lower():
            return (
                True,
                f"Verified: {name} ({info.hangul}) can mean {', '.join(info.meanings)}",
            )

    # Meaning exists but doesn't match claimed
    return (
        False,
        f"Incorrect: '{name}' means {', '.join(info.meanings)}, not '{claimed_meaning}'. {info.notes}",
    )


def get_verified_korean_meaning(name: str) -> str | None:
    """Get the verified Korean meaning for a name.

    Args:
        name: The name to look up.

    Returns:
        A string with verified meanings, or None if not in dictionary or not Korean.
    """
    info = lookup_korean_name(name)

    if info is None or not info.is_korean or not info.meanings:
        return None

    hangul_part = f" ({info.hangul})" if info.hangul else ""
    return f"{name}{hangul_part}: {', '.join(info.meanings)}"


def is_name_korean(name: str) -> bool | None:
    """Check if a name is verified as Korean.

    Args:
        name: The name to check.

    Returns:
        True if verified Korean, False if verified non-Korean, None if unknown.
    """
    info = lookup_korean_name(name)

    if info is None:
        return None

    return info.is_korean
