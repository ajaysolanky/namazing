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
