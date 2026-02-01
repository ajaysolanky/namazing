import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StudioApp } from './StudioApp'

const mockStartRun = vi.fn().mockResolvedValue({ runId: 'test-run-id' })
const mockFetchResult = vi.fn()
const mockSubscribeToRun = vi.fn().mockReturnValue(vi.fn()) // returns unsubscribe

vi.mock('../lib/api', () => ({
  startRun: (...args: any[]) => mockStartRun(...args),
  fetchResult: (...args: any[]) => mockFetchResult(...args),
}))

vi.mock('../lib/sse', () => ({
  subscribeToRun: (...args: any[]) => mockSubscribeToRun(...args),
}))

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('StudioApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStartRun.mockResolvedValue({ runId: 'test-run-id' })
    mockSubscribeToRun.mockReturnValue(vi.fn())
  })

  describe('Initial render', () => {
    it('renders the heading', () => {
      render(<StudioApp />)
      expect(screen.getByRole('heading', { name: 'Namazing' })).toBeInTheDocument()
    })

    it('renders the brief textarea', () => {
      render(<StudioApp />)
      expect(screen.getByPlaceholderText(/Paste your client\u2019s brief/i)).toBeInTheDocument()
    })

    it('renders the Start button', () => {
      render(<StudioApp />)
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })

    it('does not show download buttons initially', () => {
      render(<StudioApp />)
      expect(screen.queryByText('Download JSON')).not.toBeInTheDocument()
      expect(screen.queryByText('Download Markdown')).not.toBeInTheDocument()
    })
  })

  describe('Empty brief validation', () => {
    it('shows error when clicking Start with empty brief', () => {
      render(<StudioApp />)

      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      expect(screen.getByText('Please paste a client brief to start.')).toBeInTheDocument()
      expect(mockStartRun).not.toHaveBeenCalled()
    })

    it('shows error when brief is only whitespace', () => {
      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: '   ' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      expect(screen.getByText('Please paste a client brief to start.')).toBeInTheDocument()
      expect(mockStartRun).not.toHaveBeenCalled()
    })
  })

  describe('Starting a run', () => {
    it('calls startRun with brief and mode when brief has content', async () => {
      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: 'We want a classic name.' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      await waitFor(() => {
        expect(mockStartRun).toHaveBeenCalledWith('We want a classic name.', 'serial')
      })
    })

    it('shows "Running..." text while the run is in progress', async () => {
      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: 'A brief' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      await waitFor(() => {
        expect(screen.getByText('Running...')).toBeInTheDocument()
      })
    })

    it('subscribes to SSE events after receiving runId', async () => {
      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: 'Test brief' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      await waitFor(() => {
        expect(mockSubscribeToRun).toHaveBeenCalledWith('test-run-id', expect.any(Function))
      })
    })
  })

  describe('SSE event handling', () => {
    async function startRunAndCaptureCallback() {
      let capturedCallback: (event: Record<string, unknown>) => void = () => {}
      mockSubscribeToRun.mockImplementation((_runId: string, cb: (event: Record<string, unknown>) => void) => {
        capturedCallback = cb
        return vi.fn()
      })

      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: 'Test brief' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      await waitFor(() => {
        expect(mockStartRun).toHaveBeenCalled()
      })

      return capturedCallback
    }

    it('handles card partial events', async () => {
      const callback = await startRunAndCaptureCallback()

      act(() => {
        callback({
          t: 'partial',
          field: 'card',
          value: {
            name: 'Luna',
            ipa: 'luna',
            syllables: 2,
          },
        })
      })

      expect(screen.getByText('Luna')).toBeInTheDocument()
    })

    it('handles result event from report-composer and fetches result', async () => {
      const mockResult = {
        profile: { family: { surname: 'Doe' } },
        report: {
          summary: 'Done.',
          finalists: [],
          tradeoffs: [],
          tie_break_tips: [],
        },
        candidates: [],
      }
      mockFetchResult.mockResolvedValue(mockResult)

      const callback = await startRunAndCaptureCallback()

      act(() => {
        callback({ t: 'result', agent: 'report-composer' })
      })

      await waitFor(() => {
        expect(mockFetchResult).toHaveBeenCalledWith('test-run-id')
      })

      // Download buttons appear when result is set
      await waitFor(() => {
        expect(screen.getByText('Download JSON')).toBeInTheDocument()
        expect(screen.getByText('Download Markdown')).toBeInTheDocument()
      })

      // Running state should clear, Start button should return
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })

    it('handles error events', async () => {
      const callback = await startRunAndCaptureCallback()

      act(() => {
        callback({ t: 'error', msg: 'Something went wrong on the server' })
      })

      expect(screen.getByText('Something went wrong on the server')).toBeInTheDocument()
      // Running state should clear
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })
  })

  describe('Download buttons', () => {
    it('appear when result is available', async () => {
      const mockResult = {
        profile: { family: { surname: 'Doe' } },
        report: {
          summary: 'Done.',
          finalists: [],
          tradeoffs: [],
          tie_break_tips: [],
        },
        candidates: [],
      }
      mockFetchResult.mockResolvedValue(mockResult)

      let capturedCallback: (event: Record<string, unknown>) => void = () => {}
      mockSubscribeToRun.mockImplementation((_runId: string, cb: (event: Record<string, unknown>) => void) => {
        capturedCallback = cb
        return vi.fn()
      })

      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: 'Brief content' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      await waitFor(() => expect(mockStartRun).toHaveBeenCalled())

      act(() => {
        capturedCallback({ t: 'result', agent: 'report-composer' })
      })

      await waitFor(() => {
        expect(screen.getByText('Download JSON')).toBeInTheDocument()
        expect(screen.getByText('Download Markdown')).toBeInTheDocument()
      })
    })
  })

  describe('Error handling', () => {
    it('shows error when startRun rejects', async () => {
      mockStartRun.mockRejectedValueOnce(new Error('Network failure'))

      render(<StudioApp />)

      fireEvent.change(screen.getByPlaceholderText(/Paste your client\u2019s brief/i), {
        target: { value: 'Some brief' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Start' }))

      await waitFor(() => {
        expect(screen.getByText('Network failure')).toBeInTheDocument()
      })

      // Running state should clear
      expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    })
  })
})
