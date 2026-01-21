"""LLM client for calling OpenRouter API."""

import asyncio
import json
import os
from typing import Any, TypeVar

import httpx
from pydantic import BaseModel

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
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY missing. Set it to enable live agent runs.")

    model = model or os.environ.get("LLM_MODEL", DEFAULT_MODEL)
    provider = os.environ.get("LLM_PROVIDER")

    all_messages = []
    if system:
        all_messages.append({"role": "system", "content": system})
    all_messages.extend(messages)

    payload: dict[str, Any] = {
        "model": model,
        "messages": all_messages,
        "temperature": temperature,
    }
    if provider:
        payload["provider"] = {"order": [provider], "allow_fallbacks": False}
        
    if json_mode:
        payload["response_format"] = {"type": "json_object"}

    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    OPENROUTER_URL,
                    headers={
                        "Authorization": f"Bearer {api_key}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                    timeout=60.0,
                )
                
                if response.status_code == 429:
                    if attempt < max_retries - 1:
                        wait = (attempt + 1) * 2
                        await asyncio.sleep(wait)
                        continue
                
                response.raise_for_status()
                data = response.json()
                
                # Log raw interaction if DEBUG_LLM is set
                if os.environ.get("DEBUG_LLM"):
                     with open("llm_debug.log", "a") as f:
                        f.write(f"\n--- REQUEST ({model}) ---\n")
                        f.write(json.dumps(payload, indent=2))
                        f.write(f"\n--- RESPONSE ---\n")
                        f.write(json.dumps(data, indent=2))
                        f.write("\n------------------------\n")

                break
        except (httpx.HTTPError, httpx.TimeoutException) as e:
            if attempt < max_retries - 1:
                await asyncio.sleep(1)
                continue
            raise e
    else:
        raise Exception(f"Failed after {max_retries} attempts")

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
) -> T:
    """Run an agent that returns JSON validated against a Pydantic schema."""
    segments = load_prompt_segments(prompt_slug)
    content = f"{segments.instruction}\n\n{user_input}".strip()

    raw = await call_llm(
        model=model,
        system=segments.system,
        messages=[{"role": "user", "content": content}],
        json_mode=json_mode,
        temperature=temperature,
    )

    parsed = extract_json(raw)
    return schema.model_validate(parsed)
