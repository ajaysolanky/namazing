"""Session profile schemas - parsed client brief."""

from typing import Literal

from pydantic import BaseModel


class MiddleNames(BaseModel):
    """Pre-selected middle names."""

    boy: str | None = None
    girl: str | None = None


class HonorNames(BaseModel):
    """Family names to honor in suggestions."""

    surname: str | None = None
    siblings: list[str] | None = None
    honor_names: list[str] | None = None
    special_initials_include: list[str] | None = None
    special_initials_avoid: list[str] | None = None
    middle_names: MiddleNames | None = None


class Preferences(BaseModel):
    """Naming preferences extracted from the brief."""

    style_lanes: list[str] | None = None
    avoid_endings: list[str] | None = None
    nickname_tolerance: Literal["low", "medium", "high"] | None = None
    length_pref: Literal["short", "short-to-medium", "any"] | None = None
    cultural_bounds: list[str] | None = None
    phonetic_constraints: list[str] | None = None  # e.g., ["no R start", "no L end"]
    frozen_callback: bool | None = None


class Veto(BaseModel):
    """Names to avoid."""

    hard: list[str] | None = None
    soft: list[str] | None = None


class SessionProfile(BaseModel):
    """Complete parsed session profile from client brief."""

    raw_brief: str
    family: HonorNames | None = None
    preferences: Preferences | None = None
    themes: list[str] | None = None
    vetoes: Veto | None = None
    region: list[str] | None = None
    target_popularity_band: str | None = None
    comments: str | None = None
