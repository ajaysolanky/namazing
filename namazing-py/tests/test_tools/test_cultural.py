"""Tests for cultural module."""

import pytest

from namazing.tools.cultural import (
    lookup_korean_name,
    verify_korean_meaning,
    get_verified_korean_meaning,
    is_name_korean,
)


class TestLookupKoreanName:
    """Tests for lookup_korean_name function."""

    def test_known_korean_name(self):
        info = lookup_korean_name("mae")
        assert info is not None
        assert info.hangul == "\ub9e4"
        assert "plum" in info.meanings
        assert "hawk" in info.meanings
        assert info.is_korean is True

    def test_non_korean_name_in_dict(self):
        info = lookup_korean_name("mei")
        assert info is not None
        assert info.hangul is None
        assert info.is_korean is False
        assert info.origin == "Chinese"

    def test_unknown_name(self):
        info = lookup_korean_name("xyzabc123")
        assert info is None

    def test_case_insensitive(self):
        info1 = lookup_korean_name("Mae")
        info2 = lookup_korean_name("MAE")
        info3 = lookup_korean_name("mae")

        assert info1 is not None
        assert info2 is not None
        assert info3 is not None
        assert info1.hangul == info2.hangul == info3.hangul


class TestVerifyKoreanMeaning:
    """Tests for verify_korean_meaning function."""

    def test_correct_meaning(self):
        verified, explanation = verify_korean_meaning("mae", "plum")
        assert verified is True
        assert "Verified" in explanation

    def test_incorrect_meaning(self):
        # Mae does NOT mean maple - that's a common LLM hallucination
        verified, explanation = verify_korean_meaning("mae", "maple")
        assert verified is False
        assert "Incorrect" in explanation or "plum" in explanation

    def test_non_korean_name(self):
        verified, explanation = verify_korean_meaning("mei", "beautiful")
        assert verified is False
        assert "not Korean" in explanation

    def test_unknown_name(self):
        verified, explanation = verify_korean_meaning("xyzabc", "unknown")
        assert verified is False
        assert "Unverified" in explanation or "not in" in explanation


class TestGetVerifiedKoreanMeaning:
    """Tests for get_verified_korean_meaning function."""

    def test_korean_name_returns_meaning(self):
        meaning = get_verified_korean_meaning("mae")
        assert meaning is not None
        assert "plum" in meaning.lower() or "hawk" in meaning.lower()
        assert "\ub9e4" in meaning  # hangul

    def test_non_korean_returns_none(self):
        meaning = get_verified_korean_meaning("mei")
        assert meaning is None

    def test_unknown_returns_none(self):
        meaning = get_verified_korean_meaning("xyzabc")
        assert meaning is None


class TestIsNameKorean:
    """Tests for is_name_korean function."""

    def test_korean_name(self):
        assert is_name_korean("mae") is True
        assert is_name_korean("soo") is True
        assert is_name_korean("jin") is True

    def test_non_korean_in_dict(self):
        assert is_name_korean("mei") is False  # Chinese
        assert is_name_korean("grace") is False  # English

    def test_unknown_name(self):
        assert is_name_korean("xyzabc") is None


class TestMaeNotMaple:
    """Specific regression tests for the Mae/Maple hallucination bug."""

    def test_mae_meanings_correct(self):
        info = lookup_korean_name("mae")
        assert info is not None
        # Mae means plum or hawk, NOT maple
        assert "maple" not in [m.lower() for m in info.meanings]
        assert "plum" in info.meanings
        assert "hawk" in info.meanings

    def test_mae_notes_mention_maple_misconception(self):
        info = lookup_korean_name("mae")
        assert info is not None
        # Notes should warn about the maple misconception
        assert "maple" in info.notes.lower()
        assert "NOT" in info.notes or "not" in info.notes


class TestMeiNotKorean:
    """Specific regression tests for the Mei Korean meaning hallucination."""

    def test_mei_is_chinese(self):
        info = lookup_korean_name("mei")
        assert info is not None
        assert info.origin == "Chinese"
        assert info.is_korean is False

    def test_mei_has_no_korean_meaning(self):
        info = lookup_korean_name("mei")
        assert info is not None
        assert info.meanings == []  # No Korean meanings
        assert info.hangul is None  # No hangul representation
