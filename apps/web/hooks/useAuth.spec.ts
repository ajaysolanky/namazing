import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";

// IMPORTANT: Unmock the useAuth hook so we test the real implementation
vi.unmock("@/hooks/useAuth");

// Mock the supabase client at the TOP of the file
const mockGetUser = vi.fn();
const mockOnAuthStateChange = vi.fn();
const mockSignOut = vi.fn();
const mockUnsubscribe = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
  }),
}));

// Import the hook AFTER mocking
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementation
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });
  });

  it("should start with loading state", () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it("should call supabase.auth.getUser on mount", async () => {
    const mockUser: User = {
      id: "123",
      email: "test@example.com",
    } as User;

    mockGetUser.mockResolvedValue({ data: { user: mockUser } });

    renderHook(() => useAuth());

    expect(mockGetUser).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockGetUser).toHaveBeenCalled();
    });
  });

  it("should set user and loading false after getUser resolves", async () => {
    const mockUser: User = {
      id: "123",
      email: "test@example.com",
    } as User;

    mockGetUser.mockResolvedValue({ data: { user: mockUser } });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it("should subscribe to onAuthStateChange", () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    renderHook(() => useAuth());

    expect(mockOnAuthStateChange).toHaveBeenCalledTimes(1);
    expect(mockOnAuthStateChange).toHaveBeenCalledWith(
      expect.any(Function),
    );
  });

  it("should update user when auth state changes", async () => {
    const mockUser: User = {
      id: "123",
      email: "test@example.com",
    } as User;

    mockGetUser.mockResolvedValue({ data: { user: null } });

    let authCallback: (event: string, session: any) => void = () => {};
    mockOnAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);

    // Simulate auth state change
    authCallback("SIGNED_IN", { user: mockUser });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it("should set user to null when auth state changes to signed out", async () => {
    const mockUser: User = {
      id: "123",
      email: "test@example.com",
    } as User;

    mockGetUser.mockResolvedValue({ data: { user: mockUser } });

    let authCallback: (event: string, session: any) => void = () => {};
    mockOnAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return { data: { subscription: { unsubscribe: mockUnsubscribe } } };
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    // Simulate sign out
    authCallback("SIGNED_OUT", null);

    await waitFor(() => {
      expect(result.current.user).toBe(null);
    });
  });

  it("should call supabase.auth.signOut when signOut is called", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockSignOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await result.current.signOut();

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });

  it("should set user to null after signOut is called", async () => {
    const mockUser: User = {
      id: "123",
      email: "test@example.com",
    } as User;

    mockGetUser.mockResolvedValue({ data: { user: mockUser } });
    mockSignOut.mockResolvedValue({ error: null });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    await result.current.signOut();

    await waitFor(() => {
      expect(result.current.user).toBe(null);
    });
  });

  it("should unsubscribe on unmount", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const { unmount } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(mockOnAuthStateChange).toHaveBeenCalled();
    });

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });
});
