import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Header } from "./Header";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignOut = vi.fn();

const mockUseAuth = vi.fn(() => ({
  user: null,
  loading: false,
  signOut: mockSignOut,
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      signOut: mockSignOut,
    });
  });

  it("renders brand link", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Namazing" })).toHaveAttribute("href", "/");
  });

  it("renders main nav links", () => {
    render(<Header />);
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("The Dossier")).toBeInTheDocument();
    expect(screen.getByText("Testimonials")).toBeInTheDocument();
  });

  it("renders start consultation cta when signed out", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Start Consultation" })).toHaveAttribute("href", "/intake");
  });

  it("renders without a header border to match landing reference", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).not.toHaveClass("border-b");
  });

  it("shows account dropdown and allows sign out when signed in", async () => {
    mockUseAuth.mockReturnValue({
      user: {
        email: "flow@example.com",
        user_metadata: { display_name: "Flow User" },
      },
      loading: false,
      signOut: mockSignOut,
    });

    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole("button", { name: "Open account menu" }));

    expect(screen.getByRole("menuitem", { name: "Dashboard" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("menuitem", { name: "Settings" })).toHaveAttribute("href", "/settings");

    await user.click(screen.getByRole("menuitem", { name: "Sign out" }));
    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
