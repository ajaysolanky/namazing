"""Tests for search tools."""

import pytest

from namazing.tools.search import (
    search_web,
    fetch_and_extract,
    SearchResult,
    ExtractResult,
)


class TestSearchWeb:
    """Tests for search_web function."""

    @pytest.mark.asyncio
    async def test_stub_response_without_api_key(self):
        """Test that stub response is returned without API key."""
        results = await search_web("test query")

        assert len(results) == 1
        assert "Stubbed result" in results[0].title
        assert results[0].url == "https://example.com"

    @pytest.mark.asyncio
    async def test_returns_search_results(self):
        """Test that SearchResult objects are returned."""
        results = await search_web("test")

        for result in results:
            assert isinstance(result, SearchResult)
            assert hasattr(result, "title")
            assert hasattr(result, "url")
            assert hasattr(result, "snippet")

    @pytest.mark.asyncio
    async def test_respects_top_k(self):
        """Test that top_k parameter is respected (in stub mode, always 1)."""
        results = await search_web("test", top_k=3)
        # Stub mode returns exactly 1 result
        assert len(results) == 1


class TestFetchAndExtract:
    """Tests for fetch_and_extract function."""

    @pytest.mark.asyncio
    async def test_invalid_url_returns_error(self):
        """Test that invalid URLs return error in meta."""
        result = await fetch_and_extract("http://invalid.invalid.invalid")

        assert isinstance(result, ExtractResult)
        assert result.text == ""
        assert "error" in result.meta

    @pytest.mark.asyncio
    async def test_result_structure(self):
        """Test the structure of ExtractResult."""
        result = await fetch_and_extract("http://example.com")

        assert isinstance(result, ExtractResult)
        assert isinstance(result.text, str)
        assert isinstance(result.meta, dict)


class TestSearchResult:
    """Tests for SearchResult dataclass."""

    def test_creation(self):
        """Test SearchResult creation."""
        result = SearchResult(
            title="Test Title",
            url="https://example.com",
            snippet="Test snippet",
        )

        assert result.title == "Test Title"
        assert result.url == "https://example.com"
        assert result.snippet == "Test snippet"


class TestExtractResult:
    """Tests for ExtractResult dataclass."""

    def test_creation(self):
        """Test ExtractResult creation."""
        result = ExtractResult(
            text="Extracted text content",
            meta={"description": "Page description"},
        )

        assert result.text == "Extracted text content"
        assert "description" in result.meta
