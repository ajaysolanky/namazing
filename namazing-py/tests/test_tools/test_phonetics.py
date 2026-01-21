"""Tests for phonetics tools."""

import pytest

from namazing.tools.phonetics import rough_ipa, count_syllables


class TestRoughIPA:
    """Tests for rough_ipa function."""

    @pytest.mark.parametrize(
        "name,expected",
        [
            ("Sophia", "/Soph-ee-a/"),
            ("Olivia", "/Oliv-ee-a/"),
            ("Katie", "/Kat-ee/"),
            ("Maggie", "/Magg-ee/"),
            ("Emily", "/Emil-ee/"),
            ("Henry", "/Henr-ee/"),
            ("James", "/James/"),
            ("William", "/William/"),
        ],
    )
    def test_ipa_patterns(self, name: str, expected: str):
        """Test IPA generation for various name patterns."""
        result = rough_ipa(name)
        assert result == expected

    def test_preserves_case(self):
        """Test that original case is preserved in output."""
        result = rough_ipa("SOPHIA")
        assert "SOPH" in result

    def test_empty_string(self):
        """Test handling of empty string."""
        result = rough_ipa("")
        assert result == "//"


class TestCountSyllables:
    """Tests for count_syllables function."""

    @pytest.mark.parametrize(
        "name,expected",
        [
            ("Emma", 2),
            ("Eleanor", 3),
            ("James", 1),  # 'es' ending adjustment
            ("Elizabeth", 4),
            ("Jo", 1),
            ("Beatrice", 2),  # Heuristic sees 'ea' as one group
            ("Kate", 1),  # Silent 'e' adjustment
            ("Marie", 2),  # 'ie' ending preserved
            ("Ava", 2),
            ("Lily", 2),
            ("A", 1),  # Minimum of 1
        ],
    )
    def test_syllable_counts(self, name: str, expected: int):
        """Test syllable counting for various names."""
        result = count_syllables(name)
        assert result == expected

    def test_handles_uppercase(self):
        """Test that function handles uppercase."""
        result = count_syllables("EMMA")
        assert result == 2

    def test_minimum_one_syllable(self):
        """Test that result is always at least 1."""
        # Even with consonant-only input
        result = count_syllables("xyz")
        assert result >= 1
