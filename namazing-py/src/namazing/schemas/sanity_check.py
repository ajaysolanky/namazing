"""Sanity check validation schema."""

from pydantic import BaseModel
from typing import Literal


class FlaggedName(BaseModel):
    """A name that was flagged during sanity check validation."""

    name: str
    violation: str
    severity: Literal["high", "medium", "low"]
    recommendation: Literal["remove", "keep_with_warning"]


class SanityCheckResult(BaseModel):
    """Result of the sanity check validation stage."""

    overall_pass: bool
    flagged_names: list[FlaggedName] = []
    approved_names: list[str] = []
    notes: str | None = None
