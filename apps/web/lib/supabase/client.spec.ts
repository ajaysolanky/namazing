import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @supabase/ssr before importing
const mockCreateBrowserClient = vi.fn().mockReturnValue({ auth: {} })
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateBrowserClient,
}))

// Unmock the module under test
vi.unmock('@/lib/supabase/client')

describe('Supabase Browser Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('should call createBrowserClient with env vars', async () => {
    const { createClient } = await import('./client')
    createClient()
    expect(mockCreateBrowserClient).toHaveBeenCalledWith(
      'https://test.supabase.co',
      'test-anon-key'
    )
  })

  it('should return the supabase client instance', async () => {
    const { createClient } = await import('./client')
    const client = createClient()
    expect(client).toBeDefined()
    expect(client.auth).toBeDefined()
  })
})
