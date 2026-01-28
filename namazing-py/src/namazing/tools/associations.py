"""Tools for scanning negative associations with names."""

from dataclasses import dataclass

from namazing.tools.search import search_web


@dataclass
class AssociationItem:
    """A single association found in search."""

    label: str
    url: str | None = None


@dataclass
class AssociationResult:
    """Result of scanning for negative associations."""

    items: list[AssociationItem]
    notes: str


NEGATIVE_PATTERNS = ["scandal", "controversy", "notorious"]

# Patterns that indicate a celebrity/famous person
CELEBRITY_PATTERNS = ["singer", "actor", "actress", "celebrity", "famous", "wiki", "imdb"]


async def scan_neg_associations(name: str) -> AssociationResult:
    """Search for potentially negative associations with a name.

    Args:
        name: The name to search for.

    Returns:
        AssociationResult with found items and notes.
    """
    items: list[AssociationItem] = []

    for pattern in NEGATIVE_PATTERNS:
        query = f"{name} {pattern}"
        try:
            results = await search_web(query, top_k=3)
            for result in results:
                items.append(
                    AssociationItem(
                        label=result.title,
                        url=result.url,
                    )
                )
        except Exception as e:
            return AssociationResult(
                items=items,
                notes=str(e),
            )

    if not items:
        return AssociationResult(
            items=items,
            notes="No concerning associations surfaced in stub search.",
        )

    return AssociationResult(
        items=items,
        notes="Review items manually to confirm relevance; automated search may include tangential matches.",
    )


async def scan_celebrity_associations(first_name: str, surname: str) -> AssociationResult:
    """Search for celebrities with the full name combination.

    This catches cases like "Rose Park" = Rosé from Blackpink, where the
    first name alone wouldn't trigger a flag but the full name is notable.

    Args:
        first_name: The candidate first name.
        surname: The family surname from the profile.

    Returns:
        AssociationResult with found celebrity matches and notes.
    """
    full_name = f"{first_name} {surname}"
    items: list[AssociationItem] = []

    for pattern in CELEBRITY_PATTERNS:
        query = f'"{full_name}" {pattern}'
        try:
            results = await search_web(query, top_k=3)
            for result in results:
                # Only include if the full name appears in the title or snippet
                title_lower = result.title.lower()
                snippet_lower = result.snippet.lower() if result.snippet else ""
                full_name_lower = full_name.lower()

                if full_name_lower in title_lower or full_name_lower in snippet_lower:
                    items.append(
                        AssociationItem(
                            label=f"[Celebrity] {result.title}",
                            url=result.url,
                        )
                    )
        except Exception as e:
            return AssociationResult(
                items=items,
                notes=f"Celebrity search error: {e}",
            )

    # Deduplicate by URL
    seen_urls: set[str] = set()
    unique_items: list[AssociationItem] = []
    for item in items:
        if item.url and item.url not in seen_urls:
            seen_urls.add(item.url)
            unique_items.append(item)

    if not unique_items:
        return AssociationResult(
            items=unique_items,
            notes=f"No celebrity matches found for '{full_name}'.",
        )

    return AssociationResult(
        items=unique_items,
        notes=f"Found {len(unique_items)} potential celebrity association(s) for '{full_name}'. Review to confirm if naming conflict exists.",
    )
