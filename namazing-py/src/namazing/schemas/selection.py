"""Expert selection schemas - curated finalists."""

from typing import Any

from pydantic import BaseModel, field_validator

from namazing.schemas.name_card import Combo


class Finalist(BaseModel):
    """A finalist name with reasoning."""

    name: str
    why: str
    combo: Combo | None = None

    @field_validator("combo", mode="before")
    @classmethod
    def parse_combo(cls, v: Any) -> Combo | None:
        """Handle combo as string or dict."""
        if v is None:
            return None
        if isinstance(v, Combo):
            return v
        if isinstance(v, str):
            # Parse "First Middle - Why" format
            parts = v.split(" - ", 1)
            if len(parts) == 2:
                names = parts[0].split(" ", 1)
                if len(names) >= 2:
                    return Combo(first=names[0], middle=names[1], why=parts[1])
            # Fallback: use whole string
            return Combo(first=v, middle="", why="")
        if isinstance(v, dict):
            return Combo(**v)
        return None


class NearMiss(BaseModel):
    """A near-miss name that didn't make the cut."""

    name: str
    reason: str


class ExpertSelection(BaseModel):
    """Expert-curated selection of finalists and near-misses."""

    finalists: list[Finalist]
    near_misses: list[NearMiss]
