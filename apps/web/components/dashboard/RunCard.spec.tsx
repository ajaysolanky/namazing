import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RunCard } from "./RunCard";

describe("RunCard", () => {
  const baseRun = {
    id: "run-123",
    brief: "Looking for a unique name with Irish heritage",
    mode: "guided",
    status: "completed",
    created_at: "2024-01-15T10:00:00Z",
    completed_at: "2024-01-15T10:05:00Z",
  };

  it("renders date from created_at", () => {
    render(<RunCard run={baseRun} />);
    expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument();
  });

  it("renders status badge for completed status", () => {
    render(<RunCard run={baseRun} />);
    expect(screen.getByText("completed")).toBeInTheDocument();
  });

  it("renders status badge for running status", () => {
    const runningRun = { ...baseRun, status: "running" };
    render(<RunCard run={runningRun} />);
    expect(screen.getByText("running")).toBeInTheDocument();
  });

  it("renders status badge for failed status", () => {
    const failedRun = { ...baseRun, status: "failed" };
    render(<RunCard run={failedRun} />);
    expect(screen.getByText("failed")).toBeInTheDocument();
  });

  it("renders status badge for pending status", () => {
    const pendingRun = { ...baseRun, status: "pending" };
    render(<RunCard run={pendingRun} />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("renders truncated brief text when brief is a string", () => {
    render(<RunCard run={baseRun} />);
    expect(
      screen.getByText("Looking for a unique name with Irish heritage"),
    ).toBeInTheDocument();
  });

  it("truncates brief text when longer than 120 characters", () => {
    const longBrief = "a".repeat(150);
    const runWithLongBrief = { ...baseRun, brief: longBrief };
    render(<RunCard run={runWithLongBrief} />);
    expect(screen.getByText(`${"a".repeat(120)}...`)).toBeInTheDocument();
  });

  it("renders brief text when brief is an object with text field", () => {
    const runWithObjectBrief = {
      ...baseRun,
      brief: { text: "Brief from object" },
    };
    render(<RunCard run={runWithObjectBrief} />);
    expect(screen.getByText("Brief from object")).toBeInTheDocument();
  });

  it("renders em dash when brief is an object without text field", () => {
    const runWithEmptyBrief = {
      ...baseRun,
      brief: {},
    };
    render(<RunCard run={runWithEmptyBrief} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renders View Report link for completed runs", () => {
    render(<RunCard run={baseRun} />);
    const link = screen.getByRole("link", { name: /View Report/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/report/run-123");
  });

  it("does not render View Report link for running runs", () => {
    const runningRun = { ...baseRun, status: "running" };
    render(<RunCard run={runningRun} />);
    expect(
      screen.queryByRole("link", { name: /View Report/i }),
    ).not.toBeInTheDocument();
  });

  it("does not render View Report link for failed runs", () => {
    const failedRun = { ...baseRun, status: "failed" };
    render(<RunCard run={failedRun} />);
    expect(
      screen.queryByRole("link", { name: /View Report/i }),
    ).not.toBeInTheDocument();
  });

  it("renders top finalist name when results are available as array", () => {
    const runWithResults = {
      ...baseRun,
      run_results: [
        {
          result: {
            selection: {
              finalists: [
                { name: "Siobhan", score: 95 },
                { name: "Niamh", score: 90 },
              ],
            },
          },
        },
      ],
    };
    render(<RunCard run={runWithResults} />);
    expect(screen.getByText("Siobhan")).toBeInTheDocument();
  });

  it("renders top finalist name when results are available as object", () => {
    const runWithResults = {
      ...baseRun,
      run_results: {
        result: {
          selection: {
            finalists: [{ name: "Finn", score: 92 }],
          },
        },
      },
    };
    render(<RunCard run={runWithResults} />);
    expect(screen.getByText("Finn")).toBeInTheDocument();
  });

  it("does not render finalist name when results are null", () => {
    const runWithoutResults = {
      ...baseRun,
      run_results: null,
    };
    const { container } = render(<RunCard run={runWithoutResults} />);
    expect(
      container.querySelector(".font-display.text-xl"),
    ).not.toBeInTheDocument();
  });

  it("does not render finalist name when results have no finalists", () => {
    const runWithEmptyResults = {
      ...baseRun,
      run_results: {
        result: {
          selection: {
            finalists: [],
          },
        },
      },
    };
    const { container } = render(<RunCard run={runWithEmptyResults} />);
    expect(
      container.querySelector(".font-display.text-xl"),
    ).not.toBeInTheDocument();
  });

  it("renders mode in uppercase", () => {
    render(<RunCard run={baseRun} />);
    expect(screen.getByText("guided")).toBeInTheDocument();
  });
});
