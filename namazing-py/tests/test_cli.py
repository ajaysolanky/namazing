"""Tests for the CLI."""

from typer.testing import CliRunner

from namazing.cli.app import app
from namazing import __version__


runner = CliRunner(color=False)


class TestCLI:
    """Tests for CLI commands."""

    def test_version_command(self):
        """Test the version command."""
        result = runner.invoke(app, ["version"])

        assert result.exit_code == 0
        assert __version__ in result.stdout

    def test_version_flag(self):
        """Test the --version flag."""
        result = runner.invoke(app, ["--version"])

        assert result.exit_code == 0
        assert __version__ in result.stdout

    def test_help_shows_commands(self):
        """Test that help shows available commands."""
        result = runner.invoke(app, ["--help"])

        assert result.exit_code == 0
        assert "run" in result.stdout
        assert "version" in result.stdout

    def test_run_help(self):
        """Test run command help."""
        result = runner.invoke(app, ["run", "--help"])

        assert result.exit_code == 0
        assert "--mode" in result.stdout
        assert "--output" in result.stdout
        assert "--quiet" in result.stdout

    def test_run_invalid_mode(self):
        """Test run with invalid mode."""
        result = runner.invoke(app, ["run", "Test brief", "--mode", "invalid"])

        assert result.exit_code == 1
        assert "Invalid mode" in result.stdout

    def test_run_quiet_mode(self):
        """Test run with quiet mode (should complete without error)."""
        result = runner.invoke(
            app,
            ["run", "Looking for a girl name", "--mode", "serial", "--quiet"],
            catch_exceptions=False,
        )

        # Should complete (exit code 0 for success)
        assert result.exit_code == 0

    def test_run_with_brief(self):
        """Test run command with a brief."""
        result = runner.invoke(
            app,
            [
                "run",
                "We're looking for a name for our daughter",
                "--mode",
                "serial",
                "--quiet",
            ],
        )

        assert result.exit_code == 0


class TestCLIOutput:
    """Tests for CLI output formatting."""

    def test_run_produces_output(self):
        """Test that run produces some output."""
        result = runner.invoke(
            app,
            ["run", "Test brief for girl", "--mode", "serial"],
        )

        # Should complete and produce output
        assert result.exit_code == 0
        # Should show completion message
        assert "COMPLETE" in result.stdout or len(result.stdout) > 0
