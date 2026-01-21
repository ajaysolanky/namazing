"""Tests for LLM utilities."""

import pytest
import json

from namazing.orchestrator.llm import extract_json


class TestExtractJson:
    """Tests for extract_json function."""

    def test_valid_json_object(self):
        """Test parsing valid JSON object."""
        text = '{"name": "Emma", "age": 0}'
        result = extract_json(text)

        assert result == {"name": "Emma", "age": 0}

    def test_valid_json_array(self):
        """Test parsing valid JSON array."""
        text = '[{"name": "Emma"}, {"name": "Olivia"}]'
        result = extract_json(text)

        assert isinstance(result, list)
        assert len(result) == 2

    def test_json_with_surrounding_text(self):
        """Test extracting JSON from text with surrounding content."""
        text = 'Here is the result: {"name": "Emma"} Hope this helps!'
        result = extract_json(text)

        assert result == {"name": "Emma"}

    def test_json_in_code_block(self):
        """Test extracting JSON from markdown code block."""
        text = '''```json
{"name": "Emma", "ipa": "/EM-a/"}
```'''
        result = extract_json(text)

        assert result["name"] == "Emma"
        assert result["ipa"] == "/EM-a/"

    def test_empty_string_returns_empty_dict(self):
        """Test that empty string returns empty dict."""
        result = extract_json("")
        assert result == {}

    def test_whitespace_only_returns_empty_dict(self):
        """Test that whitespace-only string returns empty dict."""
        result = extract_json("   \n\t  ")
        assert result == {}

    def test_nested_json(self):
        """Test parsing nested JSON structures."""
        text = '{"profile": {"name": "Emma", "preferences": {"style": "classic"}}}'
        result = extract_json(text)

        assert result["profile"]["name"] == "Emma"
        assert result["profile"]["preferences"]["style"] == "classic"

    def test_json_array_extraction(self):
        """Test extracting JSON array from text."""
        text = 'The candidates are: [{"name": "Emma"}, {"name": "Olivia"}] as requested.'
        result = extract_json(text)

        assert isinstance(result, list)
        assert len(result) == 2

    def test_invalid_json_raises_error(self):
        """Test that invalid JSON raises error."""
        text = 'This is not JSON at all'

        with pytest.raises(json.JSONDecodeError):
            extract_json(text)

    def test_malformed_json_raises_error(self):
        """Test that malformed JSON raises error."""
        text = '{"name": "Emma", incomplete'

        with pytest.raises(json.JSONDecodeError):
            extract_json(text)

    def test_json_with_unicode(self):
        """Test parsing JSON with unicode characters."""
        text = '{"name": "Élise", "origin": "français"}'
        result = extract_json(text)

        assert result["name"] == "Élise"
        assert result["origin"] == "français"
