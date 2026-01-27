"""Tests for validators module."""

import pytest

from namazing.schemas.profile import SessionProfile, Veto, HonorNames
from namazing.tools.validators import (
    normalize_name,
    levenshtein_distance,
    names_too_similar,
    create_veto_filter,
    create_sibling_filter,
    filter_candidates,
)


class MockCandidate:
    """Mock candidate for testing."""

    def __init__(self, name: str):
        self.name = name


class TestNormalizeName:
    """Tests for normalize_name function."""

    def test_lowercase(self):
        assert normalize_name("EMMA") == "emma"

    def test_strips_whitespace(self):
        assert normalize_name("  Emma  ") == "emma"

    def test_combined(self):
        assert normalize_name("  OLIVER  ") == "oliver"


class TestLevenshteinDistance:
    """Tests for levenshtein_distance function."""

    def test_identical_strings(self):
        assert levenshtein_distance("emma", "emma") == 0

    def test_one_insertion(self):
        assert levenshtein_distance("cat", "cats") == 1

    def test_one_deletion(self):
        assert levenshtein_distance("cats", "cat") == 1

    def test_one_substitution(self):
        assert levenshtein_distance("cat", "bat") == 1

    def test_empty_string(self):
        assert levenshtein_distance("", "abc") == 3
        assert levenshtein_distance("abc", "") == 3

    def test_both_empty(self):
        assert levenshtein_distance("", "") == 0

    def test_mae_and_may(self):
        # Mae and May should be similar (distance 1)
        assert levenshtein_distance("mae", "may") == 1

    def test_olive_oliver(self):
        # Olive and Oliver (distance 1 - one insertion 'r')
        assert levenshtein_distance("olive", "oliver") == 1


class TestNamesTooSimilar:
    """Tests for names_too_similar function."""

    def test_substring_containment_olive_oliver(self):
        # Olive is contained in Oliver
        assert names_too_similar("Olive", "Oliver") is True

    def test_substring_containment_anna_annabelle(self):
        # Anna is contained in Annabelle
        assert names_too_similar("Anna", "Annabelle") is True

    def test_substring_containment_reverse(self):
        # Should work in both directions
        assert names_too_similar("Annabelle", "Anna") is True

    def test_levenshtein_mae_may(self):
        # Distance 1, should be similar
        assert names_too_similar("Mae", "May") is True

    def test_levenshtein_emma_ella(self):
        # Distance 2, at threshold
        assert names_too_similar("Emma", "Ella") is True

    def test_distinct_names(self):
        # Charlotte and Oliver are very different
        assert names_too_similar("Charlotte", "Oliver") is False

    def test_custom_threshold(self):
        # With threshold 1, emma/ella should NOT be similar (distance 2)
        assert names_too_similar("Emma", "Ella", threshold=1) is False


class TestCreateVetoFilter:
    """Tests for create_veto_filter function."""

    def test_blocks_vetoed_name(self):
        profile = SessionProfile(
            raw_brief="test",
            vetoes=Veto(hard=["Clara", "Nora"])
        )
        filter_fn = create_veto_filter(profile)

        assert filter_fn("Clara") is False
        assert filter_fn("Nora") is False

    def test_allows_non_vetoed_name(self):
        profile = SessionProfile(
            raw_brief="test",
            vetoes=Veto(hard=["Clara", "Nora"])
        )
        filter_fn = create_veto_filter(profile)

        assert filter_fn("Emma") is True
        assert filter_fn("Oliver") is True

    def test_case_insensitive(self):
        profile = SessionProfile(
            raw_brief="test",
            vetoes=Veto(hard=["clara"])
        )
        filter_fn = create_veto_filter(profile)

        assert filter_fn("CLARA") is False
        assert filter_fn("Clara") is False
        assert filter_fn("clara") is False

    def test_no_vetoes(self):
        profile = SessionProfile(raw_brief="test")
        filter_fn = create_veto_filter(profile)

        assert filter_fn("Any name") is True

    def test_empty_vetoes(self):
        profile = SessionProfile(
            raw_brief="test",
            vetoes=Veto(hard=[])
        )
        filter_fn = create_veto_filter(profile)

        assert filter_fn("Any name") is True


class TestCreateSiblingFilter:
    """Tests for create_sibling_filter function."""

    def test_rejects_similar_to_sibling(self):
        profile = SessionProfile(
            raw_brief="test",
            family=HonorNames(siblings=["Oliver"])
        )
        filter_fn = create_sibling_filter(profile)

        # Olive is too similar to Oliver (contained)
        assert filter_fn("Olive") is False

    def test_allows_distinct_name(self):
        profile = SessionProfile(
            raw_brief="test",
            family=HonorNames(siblings=["Oliver"])
        )
        filter_fn = create_sibling_filter(profile)

        assert filter_fn("Charlotte") is True
        assert filter_fn("Emma") is True

    def test_multiple_siblings(self):
        profile = SessionProfile(
            raw_brief="test",
            family=HonorNames(siblings=["Oliver", "Emma"])
        )
        filter_fn = create_sibling_filter(profile)

        # Similar to either sibling should be rejected
        assert filter_fn("Olive") is False  # similar to Oliver
        assert filter_fn("Ella") is False   # similar to Emma
        assert filter_fn("Charlotte") is True

    def test_no_siblings(self):
        profile = SessionProfile(raw_brief="test")
        filter_fn = create_sibling_filter(profile)

        assert filter_fn("Any name") is True


class TestFilterCandidates:
    """Tests for filter_candidates function."""

    def test_filters_vetoed_names(self):
        profile = SessionProfile(
            raw_brief="test",
            vetoes=Veto(hard=["Clara"])
        )
        candidates = [
            MockCandidate("Emma"),
            MockCandidate("Clara"),
            MockCandidate("Oliver"),
        ]

        filtered = filter_candidates(candidates, profile)
        names = [c.name for c in filtered]

        assert "Clara" not in names
        assert "Emma" in names
        assert "Oliver" in names

    def test_filters_similar_to_siblings(self):
        profile = SessionProfile(
            raw_brief="test",
            family=HonorNames(siblings=["Oliver"])
        )
        candidates = [
            MockCandidate("Emma"),
            MockCandidate("Olive"),
            MockCandidate("Charlotte"),
        ]

        filtered = filter_candidates(candidates, profile)
        names = [c.name for c in filtered]

        assert "Olive" not in names
        assert "Emma" in names
        assert "Charlotte" in names

    def test_logs_filtered_names(self):
        profile = SessionProfile(
            raw_brief="test",
            vetoes=Veto(hard=["Clara"])
        )
        candidates = [MockCandidate("Clara")]
        logs = []

        filter_candidates(candidates, profile, log_callback=logs.append)

        assert len(logs) == 1
        assert "Clara" in logs[0]
        assert "veto" in logs[0].lower()
