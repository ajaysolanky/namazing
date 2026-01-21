"""Web search and content extraction tools."""

import os
from dataclasses import dataclass

import httpx
from bs4 import BeautifulSoup


DEFAULT_TOP_K = 5
SERPAPI_ENDPOINT = "https://serpapi.com/search"


@dataclass
class SearchResult:
    """A single search result."""

    title: str
    url: str
    snippet: str


@dataclass
class ExtractResult:
    """Extracted content from a URL."""

    text: str
    meta: dict[str, str]


async def search_web(
    query: str,
    *,
    region: str = "en",
    top_k: int = DEFAULT_TOP_K,
) -> list[SearchResult]:
    """Search the web using SerpAPI.

    Args:
        query: The search query.
        region: Language/region code (default: "en").
        top_k: Maximum number of results to return.

    Returns:
        List of search results, or stub results if no API key.
    """
    provider = os.environ.get("SEARCH_PROVIDER", "")
    api_key = os.environ.get("SERPAPI_KEY", "")

    if provider == "serpapi" and api_key:
        params = {
            "engine": "google",
            "q": query,
            "num": str(min(top_k, 10)),
            "hl": region,
            "api_key": api_key,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(SERPAPI_ENDPOINT, params=params)
                response.raise_for_status()
                data = response.json()

                organic = data.get("organic_results", [])
                if not isinstance(organic, list):
                    organic = []

                return [
                    SearchResult(
                        title=item.get("title", "Untitled"),
                        url=item.get("link") or item.get("url", ""),
                        snippet=item.get("snippet", "")
                        or " ".join(item.get("snippet_highlighted_words", [])),
                    )
                    for item in organic[:top_k]
                ]
        except Exception:
            # Fall through to stub results
            pass

    # Default stubbed response when provider unavailable
    return [
        SearchResult(
            title=f"Stubbed result for {query}",
            url="https://example.com",
            snippet="Search provider not configured; returning placeholder result.",
        )
    ]


async def fetch_and_extract(url: str) -> ExtractResult:
    """Fetch a URL and extract text content.

    Args:
        url: The URL to fetch.

    Returns:
        ExtractResult with text content and metadata.
    """
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            html = response.text

        soup = BeautifulSoup(html, "html.parser")

        # Remove script and style elements
        for element in soup(["script", "style"]):
            element.decompose()

        # Extract text
        text = soup.get_text(separator=" ", strip=True)
        # Normalize whitespace
        text = " ".join(text.split())

        # Extract metadata
        meta: dict[str, str] = {}
        for tag in soup.find_all("meta"):
            name = tag.get("name") or tag.get("property")
            content = tag.get("content")
            if name and content:
                meta[str(name)] = str(content)

        return ExtractResult(text=text, meta=meta)

    except Exception as e:
        return ExtractResult(
            text="",
            meta={"error": str(e)},
        )
