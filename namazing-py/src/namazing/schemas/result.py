"""Run result schemas - final pipeline output."""

from pydantic import BaseModel

from namazing.schemas.profile import SessionProfile
from namazing.schemas.name_card import NameCard, Combo
from namazing.schemas.selection import ExpertSelection, Finalist


class Report(BaseModel):
    """Final consultation report."""

    summary: str
    markdown: str | None = None
    loved_names: list[str] | None = None
    finalists: list[Finalist]
    combos: list[Combo] | None = None
    tradeoffs: list[str] | None = None
    tie_break_tips: list[str] | None = None


class RunResult(BaseModel):
    """Complete run result with all pipeline outputs."""

    profile: SessionProfile
    candidates: list[NameCard]
    selection: ExpertSelection
    report: Report
