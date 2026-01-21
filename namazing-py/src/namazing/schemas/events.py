"""Activity event schemas - pipeline progress events."""

from typing import Any, Literal, Annotated, Union

from pydantic import BaseModel, Field


class ActivityEvent(BaseModel):
    """Generic activity/progress message."""

    t: Literal["activity"] = "activity"
    run_id: str = Field(alias="runId")
    agent: str
    msg: str

    model_config = {"populate_by_name": True}


class StartEvent(BaseModel):
    """Research starting for a name."""

    t: Literal["start"] = "start"
    run_id: str = Field(alias="runId")
    agent: str
    name: str | None = None

    model_config = {"populate_by_name": True}


class LogEvent(BaseModel):
    """Log message from an agent."""

    t: Literal["log"] = "log"
    run_id: str = Field(alias="runId")
    agent: str
    name: str | None = None
    msg: str

    model_config = {"populate_by_name": True}


class PartialEvent(BaseModel):
    """Partial result from an agent."""

    t: Literal["partial"] = "partial"
    run_id: str = Field(alias="runId")
    agent: str
    name: str | None = None
    field: str
    value: Any

    model_config = {"populate_by_name": True}


class DoneEvent(BaseModel):
    """Research completed for a name."""

    t: Literal["done"] = "done"
    run_id: str = Field(alias="runId")
    agent: str
    name: str | None = None

    model_config = {"populate_by_name": True}


class ResultEvent(BaseModel):
    """Stage completion with payload."""

    t: Literal["result"] = "result"
    run_id: str = Field(alias="runId")
    agent: str
    payload: Any

    model_config = {"populate_by_name": True}


class ErrorEvent(BaseModel):
    """Error during pipeline execution."""

    t: Literal["error"] = "error"
    run_id: str = Field(alias="runId")
    agent: str
    msg: str

    model_config = {"populate_by_name": True}


# Discriminated union type for all events
Event = Annotated[
    Union[
        ActivityEvent,
        StartEvent,
        LogEvent,
        PartialEvent,
        DoneEvent,
        ResultEvent,
        ErrorEvent,
    ],
    Field(discriminator="t"),
]
