"""Pydantic schemas for namazing."""

from namazing.schemas.profile import (
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
