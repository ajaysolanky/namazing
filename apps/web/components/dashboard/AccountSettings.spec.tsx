import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountSettings } from "./AccountSettings";

// Mock the dashboard actions
vi.mock("@/app/(dashboard)/dashboard/actions", () => ({
  updateProfile: vi.fn(),
  deleteAccount: vi.fn(),
}));

describe("AccountSettings", () => {
  const defaultProps = {
    displayName: "John Doe",
    email: "john.doe@example.com",
  };

  it("renders email address", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("renders display name input with default value", () => {
    render(<AccountSettings {...defaultProps} />);
    const input = screen.getByLabelText("Display name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("John Doe");
  });

  it("renders Save changes button", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Save changes" }),
    ).toBeInTheDocument();
  });

  it("renders Delete account button", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Delete account" }),
    ).toBeInTheDocument();
  });

  it("shows confirmation buttons when Delete account is clicked", async () => {
    const user = userEvent.setup();
    render(<AccountSettings {...defaultProps} />);

    const deleteButton = screen.getByRole("button", { name: "Delete account" });
    await user.click(deleteButton);

    expect(
      screen.getByRole("button", { name: "Yes, delete my account" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("hides confirmation buttons when Cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<AccountSettings {...defaultProps} />);

    // Click delete to show confirmation
    const deleteButton = screen.getByRole("button", { name: "Delete account" });
    await user.click(deleteButton);

    expect(
      screen.getByRole("button", { name: "Yes, delete my account" }),
    ).toBeInTheDocument();

    // Click cancel
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    // Confirmation buttons should be hidden
    expect(
      screen.queryByRole("button", { name: "Yes, delete my account" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument();

    // Original delete button should be back
    expect(
      screen.getByRole("button", { name: "Delete account" }),
    ).toBeInTheDocument();
  });

  it("renders Profile section heading", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders Danger zone section heading", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(screen.getByText("Danger zone")).toBeInTheDocument();
  });

  it("renders danger zone warning message", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(
      screen.getByText(
        "Deleting your account removes all your data permanently. This cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("allows editing display name input", async () => {
    const user = userEvent.setup();
    render(<AccountSettings {...defaultProps} />);

    const input = screen.getByLabelText("Display name") as HTMLInputElement;
    await user.clear(input);
    await user.type(input, "Jane Smith");

    expect(input.value).toBe("Jane Smith");
  });

  it("renders Email label", () => {
    render(<AccountSettings {...defaultProps} />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});
