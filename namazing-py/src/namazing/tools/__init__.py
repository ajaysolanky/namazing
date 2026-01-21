"""Tools for name research and analysis."""

from namazing.tools.phonetics import rough_ipa, count_syllables
from namazing.tools.popularity import get_popularity, PopularityResult
from namazing.tools.search import search_web, fetch_and_extract, SearchResult
from namazing.tools.associations import scan_neg_associations, AssociationResult

__all__ = [
    "rough_ipa",
    "count_syllables",
    "get_popularity",
    "PopularityResult",
    "search_web",
    "fetch_and_extract",
    "SearchResult",
    "scan_neg_associations",
    "AssociationResult",
]
