"""Name card schemas - research output for a single name."""

from pydantic import BaseModel


class Nickname(BaseModel):
    """Nickname analysis for a name."""

    intended: list[str] | None = None
    likely: list[str] | None = None
    avoid: list[str] | None = None


class Popularity(BaseModel):
    """Popularity data for a name."""

    latest_rank: int | None = None
    peak_rank: int | None = None
    trend_notes: str | None = None


class NotableBearers(BaseModel):
    """Notable people with this name."""

    positive: list[str] | None = None
    fictional: list[str] | None = None
    negative: list[str] | None = None


class SurnameFit(BaseModel):
    """Analysis of name-surname fit."""

    surname: str | None = None
    notes: str


class SibsetFit(BaseModel):
    """Analysis of name-sibling set fit."""

    siblings: list[str] | None = None
    notes: str


class Combo(BaseModel):
    """A first-middle name combination suggestion."""

    first: str
    middle: str
    why: str


class NameCard(BaseModel):
    """Complete research card for a candidate name."""

    name: str
    ipa: str
    syllables: int
    meaning: str | None = None
    origins: list[str] | None = None
    variants: list[str] | None = None
    nicknames: Nickname | None = None
    popularity: Popularity | None = None
    notable_bearers: NotableBearers | None = None
    cultural_notes: list[str] | None = None
    surname_fit: SurnameFit | None = None
    sibset_fit: SibsetFit | None = None
    honor_mapping: list[str] | None = None
    combo_suggestions: list[Combo] | None = None
    eliminations: list[str] | None = None
    research_log: list[str] | None = None
