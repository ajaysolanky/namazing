import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignInPage from "./page";

// Get the mocked createClient
const mockSignInWithPassword = vi.fn();
const mockSignInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signInWithOAuth: mockSignInWithOAuth,
    },
  }),
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");
  return {
    ...actual,
    useRouter: () => ({
      push: vi.fn(),
      refresh: vi.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
  };
});

describe("SignInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock return values
    mockSignInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    });
    mockSignInWithOAuth.mockResolvedValue({ error: null });
  });

  it("renders Welcome back heading", () => {
    render(<SignInPage />);
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    render(<SignInPage />);
    expect(
      screen.getByText("Sign in to your Namazing account"),
    ).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<SignInPage />);
    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders password input", () => {
    render(<SignInPage />);
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders Sign in submit button", () => {
    render(<SignInPage />);
    expect(
      screen.getByRole("button", { name: "Sign in" }),
    ).toBeInTheDocument();
  });

  it("renders Continue with Google button", () => {
    render(<SignInPage />);
    expect(
      screen.getByRole("button", { name: /Continue with Google/i }),
    ).toBeInTheDocument();
  });

  it("renders link to sign-up page", () => {
    render(<SignInPage />);
    const signUpLink = screen.getByRole("link", { name: "Sign up" });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/sign-up");
  });

  it("renders or divider", () => {
    render(<SignInPage />);
    expect(screen.getByText("or")).toBeInTheDocument();
  });

  it("allows typing in email and password fields", async () => {
    const user = userEvent.setup();
    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      "Password",
    ) as HTMLInputElement;

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("shows error message on failed sign in", async () => {
    const user = userEvent.setup();

    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials", name: "AuthError" } as any,
    });

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "wrong@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("Invalid login credentials")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows loading state during sign in", async () => {
    const user = userEvent.setup();

    // Make the promise hang to test loading state
    let resolver: any;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });

    mockSignInWithPassword.mockReturnValue(promise as any);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Signing in..." }),
      ).toBeInTheDocument();
    });

    // Resolve the promise to clean up
    resolver({
      data: { user: { id: "123" }, session: {} },
      error: null,
    });
  });

  it("calls signInWithPassword with correct credentials", async () => {
    const user = userEvent.setup();

    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: { id: "123" } as any, session: {} as any },
      error: null,
    });

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: "test@example.com",
          password: "password123",
        });
      },
      { timeout: 3000 }
    );
  });

  it("disables submit button during loading", async () => {
    const user = userEvent.setup();

    let resolver: any;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });

    mockSignInWithPassword.mockReturnValue(promise as any);

    render(<SignInPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Sign in" });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Signing in..." }),
      ).toBeDisabled();
    });

    // Resolve the promise to clean up
    resolver({
      data: { user: { id: "123" }, session: {} },
      error: null,
    });
  });
});
