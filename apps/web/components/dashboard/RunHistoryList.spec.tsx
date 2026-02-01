import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RunHistoryList } from "./RunHistoryList";

describe("RunHistoryList", () => {
  it("renders empty state with heading when no runs", () => {
    render(<RunHistoryList runs={[]} />);
    expect(screen.getByText("No consultations yet")).toBeInTheDocument();
  });

  it("renders empty state with descriptive text when no runs", () => {
    render(<RunHistoryList runs={[]} />);
    expect(
      screen.getByText("Start your first AI-powered baby name consultation."),
    ).toBeInTheDocument();
  });

  it("renders Start consultation link in empty state", () => {
    render(<RunHistoryList runs={[]} />);
    const link = screen.getByRole("link", { name: /Start consultation/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/intake");
  });

  it("renders run cards when runs are provided", () => {
    const runs = [
      {
        id: "run-1",
        brief: "First consultation",
        mode: "guided",
        status: "completed",
        created_at: "2024-01-15T10:00:00Z",
        completed_at: "2024-01-15T10:05:00Z",
      },
      {
        id: "run-2",
        brief: "Second consultation",
        mode: "expert",
        status: "running",
        created_at: "2024-01-16T10:00:00Z",
        completed_at: null,
      },
    ];

    render(<RunHistoryList runs={runs} />);

    expect(screen.getByText("First consultation")).toBeInTheDocument();
    expect(screen.getByText("Second consultation")).toBeInTheDocument();
    expect(screen.getByText("completed")).toBeInTheDocument();
    expect(screen.getByText("running")).toBeInTheDocument();
  });

  it("does not render empty state when runs are provided", () => {
    const runs = [
      {
        id: "run-1",
        brief: "Test run",
        mode: "guided",
        status: "completed",
        created_at: "2024-01-15T10:00:00Z",
        completed_at: "2024-01-15T10:05:00Z",
      },
    ];

    render(<RunHistoryList runs={runs} />);

    expect(
      screen.queryByText("No consultations yet"),
    ).not.toBeInTheDocument();
  });

  it("renders correct number of run cards", () => {
    const runs = [
      {
        id: "run-1",
        brief: "Run 1",
        mode: "guided",
        status: "completed",
        created_at: "2024-01-15T10:00:00Z",
        completed_at: "2024-01-15T10:05:00Z",
      },
      {
        id: "run-2",
        brief: "Run 2",
        mode: "guided",
        status: "completed",
        created_at: "2024-01-16T10:00:00Z",
        completed_at: "2024-01-16T10:05:00Z",
      },
      {
        id: "run-3",
        brief: "Run 3",
        mode: "guided",
        status: "completed",
        created_at: "2024-01-17T10:00:00Z",
        completed_at: "2024-01-17T10:05:00Z",
      },
    ];

    const { container } = render(<RunHistoryList runs={runs} />);

    // Each run card has a unique brief text
    expect(screen.getByText("Run 1")).toBeInTheDocument();
    expect(screen.getByText("Run 2")).toBeInTheDocument();
    expect(screen.getByText("Run 3")).toBeInTheDocument();

    // Count the number of run cards by looking for elements with the specific class pattern
    const runCards = container.querySelectorAll(
      ".bg-white\\/80.backdrop-blur-sm.rounded-2xl",
    );
    expect(runCards.length).toBe(3);
  });
});
