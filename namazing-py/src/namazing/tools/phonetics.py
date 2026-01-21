"""Phonetic analysis tools for names."""

VOWELS = {"a", "e", "i", "o", "u", "y"}


def rough_ipa(name: str) -> str:
    """Generate a rough IPA pronunciation hint for a name.

    This is a simple heuristic-based approach, not linguistically accurate.
    """
    lower = name.lower()

    # Handle common suffix patterns
    if lower.endswith("ia"):
        return f"/{name[:-2]}-ee-a/"
    if lower.endswith("ie"):
        return f"/{name[:-2]}-ee/"
    if lower.endswith("ee"):
        return f"/{name[:-2]}-ee/"
    if lower.endswith("y"):
        return f"/{name[:-1]}-ee/"

    return f"/{name}/"


def count_syllables(name: str) -> int:
    """Count syllables in a name by counting vowel groups.

    Uses a simple heuristic: count contiguous vowel groups,
    then adjust for common silent patterns.
    """
    lower = name.lower()
    syllables = 0
    prev_was_vowel = False

    for char in lower:
        is_vowel = char in VOWELS
        if is_vowel and not prev_was_vowel:
            syllables += 1
        prev_was_vowel = is_vowel

    # Adjust for silent 'e' patterns
    # Silent 'e' at end (like "Kate", "Jane")
    if lower.endswith("e") and len(lower) > 2:
        # But not if it's a pronounced ending like "ie" -> "ee" sound
        if not lower.endswith("ie"):
            syllables = max(1, syllables - 1)

    # Handle 'es' ending (like "James") - the 'e' is often silent
    if lower.endswith("es") and len(lower) > 3:
        syllables = max(1, syllables - 1)

    # Handle 'ed' ending similarly
    if lower.endswith("ed") and len(lower) > 3:
        syllables = max(1, syllables - 1)

    return max(1, syllables)
