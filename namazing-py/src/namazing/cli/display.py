"""Rich display components for the CLI."""

from dataclasses import dataclass, field

from rich.console import Console, Group
from rich.live import Live
from rich.panel import Panel
from rich.progress import (
    Progress,
    SpinnerColumn,
    TextColumn,
    BarColumn,
    TaskProgressColumn,
)
from rich.table import Table
from rich.text import Text

from namazing.schemas.events import Event
from namazing.schemas.selection import ExpertSelection
from namazing.schemas.result import Report


@dataclass
class PipelineStage:
    """A stage in the pipeline."""

    name: str
    description: str
    completed: bool = False
    active: bool = False
    progress: float = 0.0


@dataclass
class ResearchedName:
    """A researched name for display."""

    name: str
    syllables: int
    ipa: str
    theme: str


@dataclass
class DisplayState:
    """State for the live display."""

    brief: str
    mode: str
    stages: list[PipelineStage] = field(default_factory=list)
    researched_names: list[ResearchedName] = field(default_factory=list)
    candidate_themes: dict[str, str] = field(default_factory=dict)
    total_candidates: int = 0
    current_message: str = ""

    def __post_init__(self) -> None:
        if not self.stages:
            self.stages = [
                PipelineStage("brief-parser", "Parsing Brief"),
                PipelineStage("generator", "Generating Names"),
                PipelineStage("researcher", "Researching Names"),
                PipelineStage("expert-selector", "Selecting Finalists"),
                PipelineStage("report-composer", "Composing Report"),
            ]


class PipelineDisplay:
    """Rich display for the pipeline progress."""

    def __init__(self, brief: str, mode: str, quiet: bool = False) -> None:
        self.console = Console()
        self.quiet = quiet
        self.state = DisplayState(brief=brief, mode=mode)
        self._live: Live | None = None

    def _get_stage(self, agent: str) -> PipelineStage | None:
        """Get a stage by agent name."""
        for stage in self.state.stages:
            if stage.name == agent:
                return stage
        return None

    def _build_header_panel(self) -> Panel:
        """Build the header panel with brief and mode."""
        brief_text = self.state.brief
        if len(brief_text) > 60:
            brief_text = brief_text[:57] + "..."

        content = Text()
        content.append("Brief: ", style="bold")
        content.append(brief_text + "\n")
        content.append("Mode: ", style="bold")
        content.append(self.state.mode)

        return Panel(content, title="Namazing Pipeline", border_style="blue")

    def _build_progress_panel(self) -> Panel:
        """Build the progress panel with stage indicators."""
        progress = Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(bar_width=20),
            TaskProgressColumn(),
            expand=True,
        )

        for stage in self.state.stages:
            completed = 100 if stage.completed else (stage.progress * 100)
            style = "green" if stage.completed else ("yellow" if stage.active else "dim")
            progress.add_task(
                f"[{style}]{stage.description}",
                completed=completed,
                total=100,
            )

        return Panel(progress, title="Pipeline Progress", border_style="cyan")

    def _build_research_table(self) -> Panel | None:
        """Build the research progress table."""
        if not self.state.researched_names:
            return None

        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("Name", style="cyan", width=12)
        table.add_column("Syllables", justify="center", width=9)
        table.add_column("IPA", width=15)
        table.add_column("Theme", width=20)

        # Show last 8 researched names
        for name in self.state.researched_names[-8:]:
            table.add_row(
                name.name,
                str(name.syllables),
                name.ipa,
                name.theme,
            )

        # Add progress info
        total = self.state.total_candidates
        done = len(self.state.researched_names)
        title = f"Names Researched ({done}/{total})" if total else "Names Researched"

        return Panel(table, title=title, border_style="green")

    def _build_display(self) -> Group:
        """Build the complete display."""
        panels = [
            self._build_header_panel(),
            self._build_progress_panel(),
        ]

        research_panel = self._build_research_table()
        if research_panel:
            panels.append(research_panel)

        if self.state.current_message:
            panels.append(
                Panel(
                    Text(self.state.current_message, style="italic"),
                    border_style="dim",
                )
            )

        return Group(*panels)

    def start(self) -> None:
        """Start the live display."""
        if self.quiet:
            return
        self._live = Live(
            self._build_display(),
            console=self.console,
            refresh_per_second=4,
        )
        self._live.start()

    def stop(self) -> None:
        """Stop the live display."""
        if self._live:
            self._live.stop()
            self._live = None

    def update(self) -> None:
        """Update the live display."""
        if self._live:
            self._live.update(self._build_display())

    def handle_event(self, event: Event) -> None:
        """Handle a pipeline event."""
        if self.quiet:
            return

        event_type = event.t

        if event_type == "activity":
            stage = self._get_stage(event.agent)
            if stage:
                stage.active = True
                self.state.current_message = event.msg

        elif event_type == "start":
            stage = self._get_stage(event.agent)
            if stage:
                stage.active = True

        elif event_type == "done":
            if event.agent == "researcher" and event.name:
                # Update research progress
                if self.state.total_candidates > 0:
                    done = len(self.state.researched_names)
                    stage = self._get_stage("researcher")
                    if stage:
                        stage.progress = done / self.state.total_candidates

        elif event_type == "partial":
            if event.agent == "generator" and event.field == "candidates":
                value = event.value
                if isinstance(value, list):
                    self.state.total_candidates = len(value)
                    # Store themes
                    for c in value:
                        if isinstance(c, dict) and "name" in c and "theme" in c:
                            self.state.candidate_themes[c["name"]] = c["theme"]

            elif event.agent == "researcher" and event.field == "card":
                value = event.value
                if isinstance(value, dict):
                    name = value.get("name", "")
                    # Find the theme for this name
                    theme = self.state.candidate_themes.get(name, "unknown")
                    self.state.researched_names.append(
                        ResearchedName(
                            name=name,
                            syllables=value.get("syllables", 0),
                            ipa=value.get("ipa", ""),
                            theme=theme,
                        )
                    )

        elif event_type == "result":
            stage = self._get_stage(event.agent)
            if stage:
                stage.completed = True
                stage.active = False
                stage.progress = 1.0

        elif event_type == "log":
            self.state.current_message = f"[{event.agent}] {event.msg}"

        elif event_type == "error":
            self.state.current_message = f"ERROR: {event.msg}"

        self.update()


def print_results(
    console: Console,
    selection: ExpertSelection,
    report: Report,
) -> None:
    """Print the final results."""
    console.print()
    console.print("=" * 60, style="bold green")
    console.print("PIPELINE COMPLETE!", style="bold green", justify="center")
    console.print("=" * 60, style="bold green")
    console.print()

    # Finalists table
    table = Table(
        title="Finalists",
        show_header=True,
        header_style="bold magenta",
    )
    table.add_column("#", style="dim", width=3)
    table.add_column("Name", style="cyan", width=15)
    table.add_column("Why", width=40)
    table.add_column("Combo", width=25)

    for i, finalist in enumerate(selection.finalists, start=1):
        combo = ""
        if finalist.combo:
            combo = f"{finalist.combo.first} {finalist.combo.middle}"
        table.add_row(str(i), finalist.name, finalist.why, combo)

    console.print(table)
    console.print()

    # Summary panel
    console.print(
        Panel(
            Text(report.summary),
            title="Summary",
            border_style="blue",
        )
    )
    console.print()

    # Near misses
    if selection.near_misses:
        console.print("[bold]Near Misses:[/bold]")
        for nm in selection.near_misses:
            console.print(f"  - {nm.name}: {nm.reason}")
        console.print()

    # Tie-break tips
    if report.tie_break_tips:
        console.print("[bold]Tie-Break Tips:[/bold]")
        for tip in report.tie_break_tips:
            console.print(f"  - {tip}")


def print_error(console: Console, error: str) -> None:
    """Print an error message."""
    console.print()
    console.print("=" * 60, style="bold red")
    console.print("PIPELINE FAILED!", style="bold red", justify="center")
    console.print("=" * 60, style="bold red")
    console.print()
    console.print(f"Error: {error}", style="red")
