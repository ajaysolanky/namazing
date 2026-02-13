import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpPage from "./page";

// Get the mocked functions
const mockSignUp = vi.fn();
const mockSignInWithOAuth = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
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

describe("SignUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set default mock return values
    mockSignUp.mockResolvedValue({
      data: { user: null, session: null },
      error: null,
    });
    mockSignInWithOAuth.mockResolvedValue({ error: null });
  });

  it("renders Create your account heading", () => {
    render(<SignUpPage />);
    expect(screen.getByText("Create your account")).toBeInTheDocument();
  });

  it("renders subtitle text", () => {
    render(<SignUpPage />);
    expect(
      screen.getByText("Get started with Namazing — it's free"),
    ).toBeInTheDocument();
  });

  it("renders display name input", () => {
    render(<SignUpPage />);
    const displayNameInput = screen.getByLabelText("Display name");
    expect(displayNameInput).toBeInTheDocument();
    expect(displayNameInput).toHaveAttribute("type", "text");
  });

  it("renders email input", () => {
    render(<SignUpPage />);
    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders password input", () => {
    render(<SignUpPage />);
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("renders Create account submit button", () => {
    render(<SignUpPage />);
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("renders Continue with Google button", () => {
    render(<SignUpPage />);
    expect(
      screen.getByRole("button", { name: /Continue with Google/i }),
    ).toBeInTheDocument();
  });

  it("renders link to sign-in page", () => {
    render(<SignUpPage />);
    const signInLink = screen.getByRole("link", { name: "Sign in" });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/sign-in");
  });

  it("renders or divider", () => {
    render(<SignUpPage />);
    expect(screen.getByText("or")).toBeInTheDocument();
  });

  it("allows typing in all input fields", async () => {
    const user = userEvent.setup();
    render(<SignUpPage />);

    const displayNameInput = screen.getByLabelText(
      "Display name",
    ) as HTMLInputElement;
    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      "Password",
    ) as HTMLInputElement;

    await user.type(displayNameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");

    expect(displayNameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("shows error message on failed sign up", async () => {
    const user = userEvent.setup();

    mockSignUp.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: {
        message: "User already registered",
        name: "AuthError",
      } as any,
    });

    render(<SignUpPage />);

    const displayNameInput = screen.getByLabelText("Display name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Create account" });

    await user.type(displayNameInput, "John Doe");
    await user.type(emailInput, "existing@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(screen.getByText("User already registered")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows loading state during sign up", async () => {
    const user = userEvent.setup();

    let resolver: any;
    const promise = new Promise((resolve) => {
      resolver = resolve;
    });

    mockSignUp.mockReturnValue(promise as any);

    render(<SignUpPage />);

    const displayNameInput = screen.getByLabelText("Display name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Create account" });

    await user.type(displayNameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Creating account..." }),
      ).toBeInTheDocument();
    });

    // Resolve the promise to clean up
    resolver({
      data: { user: { id: "123" }, session: {} },
      error: null,
    });
  });

  it("calls signUp with correct data including display name", async () => {
    const user = userEvent.setup();

    mockSignUp.mockResolvedValueOnce({
      data: { user: { id: "123" } as any, session: {} as any },
      error: null,
    });

    render(<SignUpPage />);

    const displayNameInput = screen.getByLabelText("Display name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Create account" });

    await user.type(displayNameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(
      () => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: "john@example.com",
          password: "password123",
          options: {
            data: { display_name: "John Doe" },
          },
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

    mockSignUp.mockReturnValue(promise as any);

    render(<SignUpPage />);

    const displayNameInput = screen.getByLabelText("Display name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: "Create account" });

    await user.type(displayNameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Creating account..." }),
      ).toBeDisabled();
    });

    // Resolve the promise to clean up
    resolver({
      data: { user: { id: "123" }, session: {} },
      error: null,
    });
  });

  it("password input has minimum length attribute", () => {
    render(<SignUpPage />);
    const passwordInput = screen.getByLabelText("Password");
    expect(passwordInput).toHaveAttribute("minLength", "6");
  });

  it("email and password inputs are required", () => {
    render(<SignUpPage />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });
});
