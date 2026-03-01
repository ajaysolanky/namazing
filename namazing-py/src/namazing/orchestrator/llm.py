"""LLM client for calling OpenRouter API."""

import asyncio
import json
import os
import sys
import time
from typing import Any, TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from namazing.orchestrator.prompts import load_prompt_segments


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-oss-20b"

T = TypeVar("T", bound=BaseModel)


async def call_llm(
    *,
    model: str | None = None,
    system: str | None = None,
    messages: list[dict[str, str]],
    json_mode: bool = False,
    temperature: float = 0.2,
    max_retries: int = 3,
) -> str:
    """Call the OpenRouter API.

    Args:
        model: The model identifier (defaults to google/gemini-2.0-flash-001).
        system: Optional system message.
        messages: List of message dicts with 'role' and 'content'.
        json_mode: Whether to request JSON output format.
        temperature: Sampling temperature.
        max_retries: Number of retries for rate limits or transient errors.

    Returns:
        The assistant's response text.
    """
    api_key = os.environ.get("OPENROUTER_API_KEY")
    proxy_url = os.environ.get("NAMAZING_LLM_PROXY_URL")
    proxy_token = os.environ.get("NAMAZING_LLM_PROXY_TOKEN")

    if not proxy_url and not api_key:
        raise ValueError("OPENROUTER_API_KEY missing. Set it to enable live agent runs.")

    model = model or os.environ.get("LLM_MODEL", DEFAULT_MODEL)
    provider = os.environ.get("LLM_PROVIDER")

    all_messages = []
    if system:
        all_messages.append({"role": "system", "content": system})
    all_messages.extend(messages)

    if json_mode:
        response_format: dict[str, Any] | None = {"type": "json_object"}
    else:
        response_format = None

    t0 = time.monotonic()

    async def make_proxy_request() -> httpx.Response:
        payload: dict[str, Any] = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "json": json_mode,
        }
        if system:
            payload["system"] = system

        async with httpx.AsyncClient() as client:
            return await client.post(
                proxy_url,
                headers={
                    "Content-Type": "application/json",
                    "x-namazing-internal-token": proxy_token or "",
                },
                json=payload,
                timeout=60.0,
            )

    async def make_request(provider_override: str | None) -> httpx.Response:
        payload: dict[str, Any] = {
            "model": model,
            "messages": all_messages,
            "temperature": temperature,
        }
        if provider_override:
            payload["provider"] = {"order": [provider_override], "allow_fallbacks": False}
        if response_format:
            payload["response_format"] = response_format

        async with httpx.AsyncClient() as client:
            return await client.post(
                OPENROUTER_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=60.0,
            )

    active_provider = provider

    for attempt in range(max_retries):
        try:
            if proxy_url:
                response = await make_proxy_request()
            else:
                response = await make_request(active_provider)

            if not proxy_url and response.status_code == 429 and active_provider:
                print(
                    f"[llm] Rate limited (429) for {model} via provider={active_provider}, retrying without pinned provider",
                    file=sys.stderr,
                )
                active_provider = None
                continue

            if not proxy_url and response.status_code == 429:
                if attempt < max_retries - 1:
                    wait = (attempt + 1) * 2
                    print(
                        f"[llm] Rate limited (429) for {model}, retrying in {wait}s (attempt {attempt + 1}/{max_retries})",
                        file=sys.stderr,
                    )
                    await asyncio.sleep(wait)
                    continue

            response.raise_for_status()
            data = response.json()

            # Log raw interaction if DEBUG_LLM is set
            if os.environ.get("DEBUG_LLM"):
                with open("llm_debug.log", "a") as f:
                    f.write(f"\n--- REQUEST ({model}) ---\n")
                    if proxy_url:
                        debug_payload = {
                            "proxy_url": proxy_url,
                            "model": model,
                            "messages": messages,
                            "temperature": temperature,
                            "json": json_mode,
                        }
                        if system:
                            debug_payload["system"] = system
                    else:
                        debug_payload = {
                            "model": model,
                            "messages": all_messages,
                            "temperature": temperature,
                        }
                        if active_provider:
                            debug_payload["provider"] = {
                                "order": [active_provider],
                                "allow_fallbacks": False,
                            }
                        if response_format:
                            debug_payload["response_format"] = response_format
                    f.write(json.dumps(debug_payload, indent=2))
                    f.write("\n--- RESPONSE ---\n")
                    f.write(json.dumps(data, indent=2))
                    f.write("\n------------------------\n")

            elapsed = time.monotonic() - t0
            provider_label = (
                "namazing-server-proxy" if proxy_url else (active_provider or "openrouter-auto")
            )
            print(
                f"[llm] {model} via {provider_label} completed in {elapsed:.1f}s", file=sys.stderr
            )
            break
        except (httpx.HTTPError, httpx.TimeoutException) as e:
            if attempt < max_retries - 1:
                print(
                    f"[llm] {type(e).__name__} for {model}, retrying (attempt {attempt + 1}/{max_retries})",
                    file=sys.stderr,
                )
                await asyncio.sleep(1)
                continue
            raise e
    else:
        raise Exception(f"Failed after {max_retries} attempts")

    if proxy_url:
        return data.get("content", "")

    choices = data.get("choices", [])
    if not choices:
        return ""

    return choices[0].get("message", {}).get("content", "")


def extract_json(text: str) -> Any:
    """Extract JSON from LLM response text."""
    trimmed = text.strip()
    if not trimmed:
        return {}

    try:
        return json.loads(trimmed)
    except json.JSONDecodeError:
        pass

    # Try to extract JSON object
    start = trimmed.find("{")
    end = trimmed.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(trimmed[start : end + 1])
        except json.JSONDecodeError:
            pass

    # Try to extract JSON array
    start = trimmed.find("[")
    end = trimmed.rfind("]")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(trimmed[start : end + 1])
        except json.JSONDecodeError:
            pass

    raise json.JSONDecodeError("No valid JSON found", trimmed, 0)


async def run_json_agent(
    *,
    prompt_slug: str,
    model: str | None = None,
    user_input: str,
    schema: type[T],
    json_mode: bool = True,
    temperature: float = 0.3,
    max_retries: int = 3,
) -> T:
    """Run an agent that returns JSON validated against a Pydantic schema."""
    segments = load_prompt_segments(prompt_slug)
    content = f"{segments.instruction}\n\n{user_input}".strip()

    last_error: Exception | None = None

    for attempt in range(max_retries):
        try:
            raw = await call_llm(
                model=model,
                system=segments.system,
                messages=[{"role": "user", "content": content}],
                json_mode=json_mode,
                temperature=temperature,
            )

            parsed = extract_json(raw)
            return schema.model_validate(parsed)
        except (json.JSONDecodeError, ValidationError) as e:
            last_error = e
            if attempt < max_retries - 1:
                print(
                    f"Warning: Validation/JSON error in {prompt_slug} (attempt {attempt + 1}/{max_retries}): {e}",
                    file=sys.stderr,
                )
                await asyncio.sleep(0.5)  # Brief pause
                continue
            raise e

    if last_error:
        raise last_error
    raise Exception("Unknown error in run_json_agent")
