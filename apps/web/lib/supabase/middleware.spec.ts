import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockCreateServerClient = vi.fn().mockReturnValue({
  auth: { getUser: mockGetUser },
});

vi.mock("@supabase/ssr", () => ({
  createServerClient: (...args: any[]) => mockCreateServerClient(...args),
}));

// Mock NextResponse
const mockNextResponseNext = vi.fn().mockReturnValue({
  cookies: { set: vi.fn() },
});
const mockNextResponseRedirect = vi.fn().mockImplementation((url) => ({
  type: "redirect",
  url: url.toString(),
  cookies: { set: vi.fn() },
}));

vi.mock("next/server", () => ({
  NextResponse: {
    next: (...args: any[]) => mockNextResponseNext(...args),
    redirect: (...args: any[]) => mockNextResponseRedirect(...args),
  },
}));

import { updateSession } from "./middleware";

function mockRequest(pathname: string) {
  const url = new URL(`http://localhost:3000${pathname}`);
  // Add clone() to mimic NextURL behaviour
  (url as any).clone = () => new URL(url.toString());
  return {
    cookies: {
      getAll: vi.fn().mockReturnValue([]),
      set: vi.fn(),
    },
    nextUrl: url,
  } as any;
}

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  });

  it("should create Supabase client with env vars and cookie handlers", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const req = mockRequest("/");

    await updateSession(req);

    expect(mockCreateServerClient).toHaveBeenCalledWith(
      "https://test.supabase.co",
      "test-anon-key",
      expect.objectContaining({
        cookies: expect.objectContaining({
          getAll: expect.any(Function),
          setAll: expect.any(Function),
        }),
      })
    );
  });

  it("should call getUser", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const req = mockRequest("/");

    await updateSession(req);

    expect(mockGetUser).toHaveBeenCalled();
  });

  it.each(["/dashboard", "/report/some-id"])(
    "should allow authenticated user to access protected path %s",
    async (pathname) => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      const req = mockRequest(pathname);

      const res = await updateSession(req);

      expect(mockNextResponseRedirect).not.toHaveBeenCalled();
      expect(res).toEqual(expect.objectContaining({ cookies: expect.anything() }));
    }
  );

  it("should allow unauthenticated user to access /intake", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const req = mockRequest("/intake");

    const res = await updateSession(req);

    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
    expect(res).toEqual(expect.objectContaining({ cookies: expect.anything() }));
  });

  it("should redirect unauthenticated user from /dashboard to /sign-in?next=/dashboard", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const req = mockRequest("/dashboard");

    await updateSession(req);

    expect(mockNextResponseRedirect).toHaveBeenCalledTimes(1);
    const redirectUrl = mockNextResponseRedirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe("/sign-in");
    expect(redirectUrl.searchParams.get("next")).toBe("/dashboard");
  });

  it("should redirect unauthenticated user from /report/abc to /sign-in?next=/report/abc", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });
    const req = mockRequest("/report/abc");

    await updateSession(req);

    expect(mockNextResponseRedirect).toHaveBeenCalledTimes(1);
    const redirectUrl = mockNextResponseRedirect.mock.calls[0][0];
    expect(redirectUrl.pathname).toBe("/sign-in");
    expect(redirectUrl.searchParams.get("next")).toBe("/report/abc");
  });

  it.each(["/", "/sign-in", "/about"])(
    "should allow unauthenticated user to access unprotected path %s",
    async (pathname) => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
      const req = mockRequest(pathname);

      const res = await updateSession(req);

      expect(mockNextResponseRedirect).not.toHaveBeenCalled();
      expect(res).toEqual(expect.objectContaining({ cookies: expect.anything() }));
    }
  );

  it("should return supabase response for authenticated users on any path", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const expectedResponse = { cookies: { set: vi.fn() } };
    mockNextResponseNext.mockReturnValue(expectedResponse);

    const req = mockRequest("/intake");
    const res = await updateSession(req);

    expect(res).toBe(expectedResponse);
    expect(mockNextResponseRedirect).not.toHaveBeenCalled();
  });
});
