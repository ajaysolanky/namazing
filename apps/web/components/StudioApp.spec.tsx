import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { StudioApp } from './StudioApp'
import * as api from '../lib/api'
import * as sse from '../lib/sse'

// Mock the API and SSE modules
vi.mock('../lib/api', () => ({
  startRun: vi.fn(),
  fetchResult: vi.fn()
}))

vi.mock('../lib/sse', () => ({
  subscribeToRun: vi.fn()
}))

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-url')
global.URL.revokeObjectURL = vi.fn()

describe('StudioApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default mock implementations
    vi.mocked(api.startRun).mockResolvedValue({ runId: 'test-run-id' })
    vi.mocked(sse.subscribeToRun).mockReturnValue(() => {}) // unsubscribe fn
  })

  it('should render initial state correctly', () => {
    render(<StudioApp />)
    
    expect(screen.getByRole('heading', { name: 'Namazing' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Paste your client’s brief/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
    // Download buttons should not be visible yet
    expect(screen.queryByText('Download JSON')).not.toBeInTheDocument()
  })

  it('should show error when starting with empty brief', async () => {
    render(<StudioApp />)
    
    const startBtn = screen.getByRole('button', { name: 'Start' })
    fireEvent.click(startBtn)
    
    expect(screen.getByText('Please paste a client brief to start.')).toBeInTheDocument()
    expect(api.startRun).not.toHaveBeenCalled()
  })

  it('should start run when brief is provided', async () => {
    render(<StudioApp />)
    
    const briefInput = screen.getByPlaceholderText(/Paste your client’s brief/i)
    fireEvent.change(briefInput, { target: { value: 'We want a classic name.' } })
    
    const startBtn = screen.getByRole('button', { name: 'Start' })
    fireEvent.click(startBtn)
    
    await waitFor(() => {
      expect(api.startRun).toHaveBeenCalledWith('We want a classic name.', 'serial')
      expect(screen.getByText('Running...')).toBeInTheDocument()
    })
    
    expect(sse.subscribeToRun).toHaveBeenCalledWith('test-run-id', expect.any(Function))
  })

  it('should update state based on SSE events', async () => {
    // We need to capture the callback passed to subscribeToRun
    let capturedCallback: (event: Record<string, unknown>) => void = () => {}
    vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
      capturedCallback = cb
      return () => {}
    })

    render(<StudioApp />)
    
    // Start run
    const briefInput = screen.getByPlaceholderText(/Paste your client’s brief/i)
    fireEvent.change(briefInput, { target: { value: 'Test brief' } })
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    
    await waitFor(() => {
      expect(api.startRun).toHaveBeenCalled()
    })

    // Simulate partial card event
    const cardEvent = {
      t: 'partial',
      field: 'card',
      value: {
        name: 'Luna',
        ipa: 'luna',
        syllables: 2
      }
    }
    
    act(() => {
      capturedCallback(cardEvent)
    })

    expect(screen.getByText('Luna')).toBeInTheDocument()
    expect(screen.getByText('luna')).toBeInTheDocument()
  })

  it('should handle run completion and result fetching', async () => {
    let capturedCallback: (event: Record<string, unknown>) => void = () => {}
    vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
      capturedCallback = cb
      return () => {}
    })

    const mockResult = {
      profile: { family: { surname: 'Doe' } },
      report: {
        summary: 'Done.',
        finalists: [],
        tradeoffs: [],
        tie_break_tips: []
      },
      candidates: []
    }
    vi.mocked(api.fetchResult).mockResolvedValue(mockResult)

    render(<StudioApp />)
    
    // Start...
    fireEvent.change(screen.getByPlaceholderText(/Paste your client’s brief/i), { target: { value: 'Test' } })
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    
    await waitFor(() => expect(api.startRun).toHaveBeenCalled())

    // Complete event
    act(() => {
      capturedCallback({ t: 'result', agent: 'report-composer' })
    })

    await waitFor(() => {
      expect(api.fetchResult).toHaveBeenCalledWith('test-run-id')
    })
    
    // Should see download buttons
    expect(screen.getByText('Download JSON')).toBeInTheDocument()
    
    // And running state should clear
    expect(screen.getByRole('button', { name: 'Start' })).toBeInTheDocument()
  })
})
