"""Code-based validators for deterministic name filtering.

These validators enforce hard constraints that LLMs may ignore in prompts.
Principle: validate at code boundaries, not via prompts.
"""

from typing import Callable

from namazing.schemas.profile import SessionProfile


def normalize_name(name: str) -> str:
    """Normalize a name for comparison (lowercase, stripped)."""
    return name.strip().lower()


def levenshtein_distance(s1: str, s2: str) -> int:
    """Compute Levenshtein (edit) distance between two strings.

    Uses standard dynamic programming approach.

    Args:
        s1: First string.
        s2: Second string.

    Returns:
        Minimum number of edits (insert/delete/replace) to transform s1 to s2.
    """
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)

    if len(s2) == 0:
        return len(s1)

    previous_row = list(range(len(s2) + 1))

    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            # Cost is 0 if characters match, 1 otherwise
            cost = 0 if c1 == c2 else 1
            current_row.append(
                min(
                    current_row[j] + 1,  # Insert
                    previous_row[j + 1] + 1,  # Delete
                    previous_row[j] + cost,  # Replace
                )
            )
        previous_row = current_row

    return previous_row[-1]


def names_too_similar(name1: str, name2: str, threshold: int = 2) -> bool:
    """Check if two names are too similar.

    Uses substring containment OR Levenshtein distance <= threshold.
    Examples:
        - "Olive" and "Oliver" -> True (Olive contained in Oliver)
        - "Mae" and "May" -> True (Levenshtein distance = 1)
        - "Emma" and "Ella" -> True (Levenshtein distance = 2)
        - "Charlotte" and "Oliver" -> False

    Args:
        name1: First name to compare.
        name2: Second name to compare.
        threshold: Maximum Levenshtein distance to consider "too similar".

    Returns:
        True if names are too similar, False otherwise.
    """
    n1, n2 = normalize_name(name1), normalize_name(name2)

    # Check for substring containment (Olive/Oliver problem)
    if n1 in n2 or n2 in n1:
        return True

    # Check Levenshtein distance
    return levenshtein_distance(n1, n2) <= threshold


def create_veto_filter(profile: SessionProfile) -> Callable[[str], bool]:
    """Create a filter function that rejects names in the hard veto list.

    Args:
        profile: The session profile containing vetoes.

    Returns:
        A function that returns True if the name is ALLOWED (not vetoed),
        False if the name should be rejected.
    """
    hard_vetoes: set[str] = set()

    if profile.vetoes and profile.vetoes.hard:
        hard_vetoes = {normalize_name(v) for v in profile.vetoes.hard}

    def is_allowed(name: str) -> bool:
        return normalize_name(name) not in hard_vetoes

    return is_allowed


def create_prefix_filter(profile: SessionProfile) -> Callable[[str], bool]:
    """Create a filter that rejects names starting with forbidden prefixes.

    Looks for patterns like "avoid Ma-", "no J-names", etc. in vetoes.

    Args:
        profile: The session profile containing vetoes.

    Returns:
        A function that returns True if the name is ALLOWED (no forbidden prefix),
        False if the name starts with a forbidden prefix.
    """
    forbidden_prefixes: set[str] = set()

    # Check hard vetoes for prefix patterns
    if profile.vetoes and profile.vetoes.hard:
        for veto in profile.vetoes.hard:
            v = veto.lower().strip()
            # Match patterns like "Ma-", "J-", "avoid Ma-", "no Ma-"
            if v.endswith("-"):
                # Extract the prefix (e.g., "ma" from "ma-")
                prefix = v.rstrip("-").split()[-1]  # Get last word before "-"
                forbidden_prefixes.add(prefix)

    # Also check raw brief for common patterns
    if profile.raw_brief:
        import re
        brief_lower = profile.raw_brief.lower()
        # Match "avoid [prefix]-", "no [prefix]-", "starting with [prefix]"
        patterns = [
            r'avoid\s+["\']?(\w+)-',
            r'avoid.*starting\s+with\s+["\']?(\w+)',
            r'no\s+(\w+)-\s*names',
            r'anything\s+starting\s+with\s+["\']?(\w+)',
        ]
        for pattern in patterns:
            for match in re.finditer(pattern, brief_lower):
                forbidden_prefixes.add(match.group(1).lower())

    def is_allowed(name: str) -> bool:
        name_lower = normalize_name(name)
        for prefix in forbidden_prefixes:
            if name_lower.startswith(prefix):
                return False
        return True

    return is_allowed


def create_sibling_filter(
    profile: SessionProfile, threshold: int = 2
) -> Callable[[str], bool]:
    """Create a filter function that rejects names too similar to siblings.

    Args:
        profile: The session profile containing sibling names.
        threshold: Levenshtein distance threshold for similarity.

    Returns:
        A function that returns True if the name is DISTINCT from all siblings,
        False if the name is too similar to any sibling.
    """
    siblings: list[str] = []

    if profile.family and profile.family.siblings:
        siblings = profile.family.siblings

    def is_distinct(name: str) -> bool:
        for sibling in siblings:
            if names_too_similar(name, sibling, threshold):
                return False
        return True

    return is_distinct


# Common deity/religious names that should be filtered when religious names are vetoed
DEITY_NAMES = {
    # Hindu
    "krishna", "lakshmi", "shiva", "sivan", "vishnu", "brahma", "ganesh", "ganesha",
    "durga", "kali", "saraswati", "parvati", "hanuman", "rama", "radha",
    # Christian
    "jesus", "christ", "mary", "madonna",
    # Greek
    "zeus", "athena", "apollo", "artemis", "aphrodite", "hera", "poseidon",
    "hades", "hermes", "ares", "dionysus", "demeter", "persephone",
    # Norse
    "odin", "thor", "freya", "loki", "frigg",
    # Other
    "isis", "osiris", "ra", "anubis",
}


def create_deity_filter(profile: SessionProfile) -> Callable[[str], bool]:
    """Create a filter that rejects deity/religious names when vetoed.

    Checks if the brief mentions avoiding religious/deity names and filters accordingly.

    Args:
        profile: The session profile containing vetoes.

    Returns:
        A function that returns True if the name is ALLOWED,
        False if it's a deity name and religious names are vetoed.
    """
    # Check if religious names should be avoided
    avoid_religious = False

    if profile.vetoes and profile.vetoes.hard:
        for veto in profile.vetoes.hard:
            v = veto.lower()
            if "religious" in v or "deity" in v or "god" in v:
                avoid_religious = True
                break

    if profile.raw_brief:
        brief_lower = profile.raw_brief.lower()
        if any(phrase in brief_lower for phrase in [
            "avoid religious", "no religious", "avoid deity", "no deity",
            "avoid god", "no god names", "not religious", "avoid strong religious"
        ]):
            avoid_religious = True

    def is_allowed(name: str) -> bool:
        if not avoid_religious:
            return True
        return normalize_name(name) not in DEITY_NAMES

    return is_allowed


def filter_candidates(
    candidates: list,
    profile: SessionProfile,
    *,
    log_callback: Callable[[str], None] | None = None,
) -> list:
    """Filter candidates using all validation rules.

    Applies veto filter, prefix filter, sibling similarity filter, and deity filter
    to remove names that violate hard constraints.

    Args:
        candidates: List of candidate objects (must have .name attribute).
        profile: The session profile containing constraints.
        log_callback: Optional callback for logging filtered names.

    Returns:
        Filtered list of candidates that pass all validation rules.
    """
    veto_filter = create_veto_filter(profile)
    prefix_filter = create_prefix_filter(profile)
    sibling_filter = create_sibling_filter(profile)
    deity_filter = create_deity_filter(profile)

    filtered = []
    for candidate in candidates:
        name = candidate.name if hasattr(candidate, "name") else str(candidate)

        if not veto_filter(name):
            if log_callback:
                log_callback(f"Filtered '{name}': matches hard veto")
            continue

        if not prefix_filter(name):
            if log_callback:
                log_callback(f"Filtered '{name}': starts with forbidden prefix")
            continue

        if not sibling_filter(name):
            if log_callback:
                log_callback(f"Filtered '{name}': too similar to sibling")
            continue

        if not deity_filter(name):
            if log_callback:
                log_callback(f"Filtered '{name}': deity/religious name when religious names vetoed")
            continue

        filtered.append(candidate)

    return filtered
