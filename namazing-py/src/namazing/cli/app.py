"CLI application for namazing."

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Annotated, Optional

from dotenv import load_dotenv

# Load environment variables early
load_dotenv(Path(__file__).parents[4] / ".env")
load_dotenv() # Load local .env if present as well

import typer
from rich.console import Console

from namazing import __version__
from namazing.orchestrator.service import (
    OrchestratorService,
    RunMode,
    RunRecord,
)
from namazing.schemas.events import Event
from namazing.cli.display import PipelineDisplay, print_results, print_error

app = typer.Typer(
    name="namazing",
    help="AI-powered baby naming service",
    no_args_is_help=True,
)

console = Console()

def version_callback(value: bool) -> None:
    """Print version and exit."""
    if value:
        console.print(f"namazing version {__version__}")
        raise typer.Exit()


@app.callback()
def main_callback(
    version: Annotated[
        Optional[bool],
        typer.Option(
            "--version",
            "-v",
            help="Show version and exit.",
            callback=version_callback,
            is_eager=True,
        ),
    ] = None,
) -> None:
    """Namazing - AI-powered baby naming service."""
    pass


@app.command()
def run(
    brief: Annotated[
        str,
        typer.Argument(help="The naming brief describing your preferences."),
    ],
    mode: Annotated[
        str,
        typer.Option(
            "--mode",
            "-m",
            help="Run mode: 'serial' (quick preview) or 'parallel' (full analysis).",
        ),
    ] = "parallel",
    output: Annotated[
        Optional[Path],
        typer.Option(
            "--output",
            "-o",
            help="Output file for JSON results.",
        ),
    ] = None,
    quiet: Annotated[
        bool,
        typer.Option(
            "--quiet",
            "-q",
            help="Suppress progress output.",
        ),
    ] = False,
    no_stubs: Annotated[
        bool,
        typer.Option(
            "--no-stubs",
            help="Disable fallback to stubs on error (fail noisily).",
        ),
    ] = False,
    format: Annotated[
        str,
        typer.Option(
            "--format",
            "-f",
            help="Output format: 'rich' (default) or 'json-stream'.",
        ),
    ] = "rich",
) -> None:
    """Run the naming pipeline with the given brief."""
    if mode not in ("serial", "parallel"):
        console.print(
            f"[red]Error: Invalid mode '{mode}'. Use 'serial' or 'parallel'.[/red]"
        )
        raise typer.Exit(1)

    if format not in ("rich", "json-stream"):
        console.print(
            f"[red]Error: Invalid format '{format}'. Use 'rich' or 'json-stream'.[/red]"
        )
        raise typer.Exit(1)

    run_mode: RunMode = "serial" if mode == "serial" else "parallel"

    asyncio.run(_run_pipeline(brief, run_mode, output, quiet, no_stubs, format))


async def _run_pipeline(
    brief: str,
    mode: RunMode,
    output: Path | None,
    quiet: bool,
    no_stubs: bool,
    format: str,
) -> None:
    """Run the pipeline asynchronously."""
    if format == "json-stream":
        quiet = True

    service = OrchestratorService(allow_stubs=not no_stubs)
    display = PipelineDisplay(brief, mode, quiet=quiet)

    # Event handler
    def handle_event(event: Event) -> None:
        if format == "json-stream":
            print(event.model_dump_json())
            sys.stdout.flush()
        else:
            display.handle_event(event)
            if quiet:
                # Print minimal output in quiet mode
                if event.t == "activity":
                    pass  # No output
                elif event.t == "result" and event.agent == "report-composer":
                    pass  # Will print results at the end
                elif event.t == "error":
                    console.print(f"[red]Error: {event.msg}[/red]")

    # Start the run
    record = service.start_run(brief, mode)
    service.subscribe(record.id, handle_event)

    if format == "rich":
        display.start()

    try:
        # Poll for completion
        while True:
            current = service.get_run(record.id)
            if not current:
                break

            if current.status in ("completed", "failed"):
                break

            await asyncio.sleep(0.1)

        if format == "rich":
            display.stop()

        # Handle results
        current = service.get_run(record.id)
        if current and current.status == "completed" and current.result:
            if format == "json-stream":
                print(
                    json.dumps(
                        {
                            "t": "run-complete",
                            "runId": record.id,
                            "result": current.result.model_dump(),
                        }
                    )
                )
                sys.stdout.flush()

            if format == "rich" and not quiet:
                print_results(
                    console,
                    current.result.selection,
                    current.result.report,
                )

            if output:
                output.write_text(
                    json.dumps(current.result.model_dump(), indent=2)
                )
                if format == "rich":
                    console.print(f"\nResults written to: {output}")

        elif current and current.status == "failed":
            if format == "rich":
                print_error(console, current.error or "Unknown error")
            raise typer.Exit(1)

    except KeyboardInterrupt:
        if format == "rich":
            display.stop()
            console.print("\n[yellow]Pipeline interrupted.[/yellow]")
        raise typer.Exit(130)


@app.command()
def version() -> None:
    """Show version information."""
    console.print(f"namazing version {__version__}")


def main() -> None:
    """Main entry point."""
    app()


if __name__ == "__main__":
    main()