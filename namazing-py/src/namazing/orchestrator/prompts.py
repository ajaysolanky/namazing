"""Prompt loading and caching."""

import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path


@dataclass
class PromptSegments:
    """Parsed prompt with system and instruction sections."""

    system: str
    instruction: str


def _get_prompts_dir() -> Path:
    """Get the path to the prompts directory."""
    # First check package prompts directory
    package_dir = Path(__file__).parent.parent / "prompts"
    if package_dir.exists():
        return package_dir

    # Fallback to parent directory structure
    return Path(__file__).parent.parent.parent.parent / "prompts"


@lru_cache(maxsize=32)
def load_prompt_segments(slug: str) -> PromptSegments:
    """Load and parse a prompt markdown file.

    Args:
        slug: The prompt name (without .md extension).

    Returns:
        PromptSegments with system and instruction sections.

    Raises:
        FileNotFoundError: If the prompt file doesn't exist.
    """
    prompts_dir = _get_prompts_dir()
    file_path = prompts_dir / f"{slug}.md"

    raw = file_path.read_text(encoding="utf-8")

    # Parse System section
    system_match = re.search(
        r"System:\s*([\s\S]*?)\n\nInstruction:",
        raw,
        re.IGNORECASE,
    )
    system = system_match.group(1).strip() if system_match else ""

    # Parse Instruction section
    instruction_match = re.search(
        r"Instruction:\s*([\s\S]*)$",
        raw,
        re.IGNORECASE,
    )
    instruction = instruction_match.group(1).strip() if instruction_match else ""

    return PromptSegments(system=system, instruction=instruction)


def clear_prompt_cache() -> None:
    """Clear the prompt loading cache."""
    load_prompt_segments.cache_clear()
