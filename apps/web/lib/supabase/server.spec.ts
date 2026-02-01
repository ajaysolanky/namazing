import { describe, it, expect, vi, beforeEach } from "vitest";

const mockCookieStore = {
  getAll: vi.fn().mockReturnValue([{ name: "sb-token", value: "abc" }]),
  set: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: () => mockCookieStore,
}));

const mockCreateServerClient = vi.fn().mockReturnValue({ auth: {} });
vi.mock("@supabase/ssr", () => ({
  createServerClient: (...args: any[]) => mockCreateServerClient(...args),
}));

import { createClient } from "./server";

describe("createClient (server)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  it("should call createServerClient with correct env vars", () => {
    createClient();

    expect(mockCreateServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({ cookies: expect.any(Object) }),
    );
  });

  it("should return a supabase client", () => {
    const client = createClient();

    expect(client).toEqual({ auth: {} });
  });

  it("should pass cookie handlers that call cookieStore.getAll", () => {
    createClient();

    const config = mockCreateServerClient.mock.calls[0][2];
    const result = config.cookies.getAll();

    expect(mockCookieStore.getAll).toHaveBeenCalled();
    expect(result).toEqual([{ name: "sb-token", value: "abc" }]);
  });

  it("should pass cookie handlers where setAll calls cookieStore.set for each cookie", () => {
    createClient();

    const config = mockCreateServerClient.mock.calls[0][2];
    const cookiesToSet = [
      { name: "sb-token", value: "abc", options: { path: "/" } },
      { name: "sb-refresh", value: "def", options: { path: "/", httpOnly: true } },
    ];

    config.cookies.setAll(cookiesToSet);

    expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
    expect(mockCookieStore.set).toHaveBeenCalledWith("sb-token", "abc", { path: "/" });
    expect(mockCookieStore.set).toHaveBeenCalledWith("sb-refresh", "def", {
      path: "/",
      httpOnly: true,
    });
  });

  it("should silently catch errors in setAll (for Server Component context)", () => {
    mockCookieStore.set.mockImplementation(() => {
      throw new Error("Cookies can only be modified in a Server Action or Route Handler");
    });

    createClient();

    const config = mockCreateServerClient.mock.calls[0][2];

    expect(() => {
      config.cookies.setAll([{ name: "sb-token", value: "abc", options: {} }]);
    }).not.toThrow();
  });
});
