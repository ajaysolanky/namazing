import { describe, it, expect, vi, beforeEach } from 'vitest'
import { startRun, fetchResult } from './api'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('startRun', () => {
    it('should make POST request with correct params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ runId: 'test-123', mode: 'full' }),
      })

      const result = await startRun('Looking for a name', 'full')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/run'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ brief: 'Looking for a name', mode: 'full' }),
        }
      )
      expect(result).toEqual({ runId: 'test-123', mode: 'full' })
    })

    it('should handle lite mode', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ runId: 'lite-123', mode: 'lite' }),
      })

      const result = await startRun('Quick search', 'lite')

      expect(result.mode).toBe('lite')
    })

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      })

      await expect(startRun('test', 'full')).rejects.toThrow('Failed to start run: 500')
    })

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(startRun('test', 'full')).rejects.toThrow('Network error')
    })
  })

  describe('fetchResult', () => {
    it('should make GET request with runId', async () => {
      const mockResult = {
        profile: { family: { surname: 'Smith' } },
        candidates: [],
        report: { finalists: [] },
      }
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResult),
      })

      const result = await fetchResult('run-456')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/result/run-456'),
        { cache: 'no-store' }
      )
      expect(result).toEqual(mockResult)
    })

    it('should throw error on failed request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      })

      await expect(fetchResult('invalid-id')).rejects.toThrow('Failed to fetch result: 404')
    })

    it('should throw error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'))

      await expect(fetchResult('run-123')).rejects.toThrow('Connection refused')
    })
  })
})
