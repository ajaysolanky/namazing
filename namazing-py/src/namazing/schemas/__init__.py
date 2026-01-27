"""Pydantic schemas for namazing."""

from namazing.schemas.profile import (
    MiddleNames,
    HonorNames,
    Preferences,
    Veto,
    SessionProfile,
)
from namazing.schemas.name_card import (
    Nickname,
    Popularity,
    NotableBearers,
    SurnameFit,
    SibsetFit,
    Combo,
    NameCard,
)
from namazing.schemas.selection import (
    Finalist,
    NearMiss,
    ExpertSelection,
)
from namazing.schemas.result import (
    Report,
    RunResult,
)
from namazing.schemas.sanity_check import (
    FlaggedName,
    SanityCheckResult,
)
from namazing.schemas.events import (
    ActivityEvent,
    StartEvent,
    LogEvent,
    PartialEvent,
    DoneEvent,
    ResultEvent,
    ErrorEvent,
    Event,
)

__all__ = [
    # Profile
    "MiddleNames",
    "HonorNames",
    "Preferences",
    "Veto",
    "SessionProfile",
    # NameCard
    "Nickname",
    "Popularity",
    "NotableBearers",
    "SurnameFit",
    "SibsetFit",
    "Combo",
    "NameCard",
    # Selection
    "Finalist",
    "NearMiss",
    "ExpertSelection",
    # Result
    "Report",
    "RunResult",
    # Sanity Check
    "FlaggedName",
    "SanityCheckResult",
    # Events
    "ActivityEvent",
    "StartEvent",
    "LogEvent",
    "PartialEvent",
    "DoneEvent",
    "ResultEvent",
    "ErrorEvent",
    "Event",
]
