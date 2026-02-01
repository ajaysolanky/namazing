import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUpdateSession = vi.fn().mockResolvedValue(new Response())

vi.mock('@/lib/supabase/middleware', () => ({
  updateSession: mockUpdateSession,
}))

describe('Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export a middleware function', async () => {
    const { middleware } = await import('./middleware')
    expect(typeof middleware).toBe('function')
  })

  it('should export a config with matcher', async () => {
    const { config } = await import('./middleware')
    expect(config).toBeDefined()
    expect(config.matcher).toBeDefined()
    expect(Array.isArray(config.matcher)).toBe(true)
  })

  it('should call updateSession with the request', async () => {
    const { middleware } = await import('./middleware')
    const mockRequest = { url: 'http://localhost:3000/dashboard' } as any
    await middleware(mockRequest)
    expect(mockUpdateSession).toHaveBeenCalledWith(mockRequest)
  })
})
