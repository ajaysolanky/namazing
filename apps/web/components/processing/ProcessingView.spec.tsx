import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProcessingView } from './ProcessingView'
import * as sse from '@/lib/sse'
import * as api from '@/lib/api'

vi.mock('@/lib/sse', () => ({
  subscribeToRun: vi.fn(),
}))

vi.mock('@/lib/api', () => ({
  fetchResult: vi.fn(),
}))

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/processing/test-run',
  useSearchParams: () => new URLSearchParams(),
}))

describe('ProcessingView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(sse.subscribeToRun).mockReturnValue(() => {})
  })

  describe('Rendering', () => {
    it('should render processing header', () => {
      render(<ProcessingView runId="test-run-123" />)

      expect(screen.getByText('Finding your perfect names...')).toBeInTheDocument()
    })

    it('should render stage indicator', () => {
      render(<ProcessingView runId="test-run-123" />)

      expect(screen.getAllByText('Understanding').length).toBeGreaterThan(0)
    })

    it('should render live updates section', () => {
      render(<ProcessingView runId="test-run-123" />)

      expect(screen.getByText('Live updates')).toBeInTheDocument()
    })

    it('should render names discovered section', () => {
      render(<ProcessingView runId="test-run-123" />)

      expect(screen.getByText('Names discovered')).toBeInTheDocument()
    })

    it('should show empty state for discovered names', () => {
      render(<ProcessingView runId="test-run-123" />)

      expect(screen.getByText(/names will appear here/i)).toBeInTheDocument()
    })
  })

  describe('SSE Subscription', () => {
    it('should subscribe to run events on mount', () => {
      render(<ProcessingView runId="test-run-123" />)

      expect(sse.subscribeToRun).toHaveBeenCalledWith('test-run-123', expect.any(Function))
    })

    it('should unsubscribe on unmount', () => {
      const unsubscribe = vi.fn()
      vi.mocked(sse.subscribeToRun).mockReturnValue(unsubscribe)

      const { unmount } = render(<ProcessingView runId="test-run-123" />)
      unmount()

      expect(unsubscribe).toHaveBeenCalled()
    })
  })

  describe('Event Handling', () => {
    it('should display discovered names from researcher events', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({
          t: 'partial',
          agent: 'researcher',
          value: { name: 'Luna', meaning: 'Moon' },
        })
      })

      await waitFor(() => {
        expect(screen.getByText('Luna')).toBeInTheDocument()
        expect(screen.getByText('Moon')).toBeInTheDocument()
      })
    })

    it('should update name count when names are discovered', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({
          t: 'partial',
          agent: 'researcher',
          value: { name: 'Luna', meaning: 'Moon' },
        })
        eventCallback({
          t: 'partial',
          agent: 'researcher',
          value: { name: 'Aria', meaning: 'Air' },
        })
      })

      await waitFor(() => {
        expect(screen.getByText('(2)')).toBeInTheDocument()
      })
    })

    it('should show completion state when report-composer is done', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({ t: 'done', agent: 'report-composer' })
      })

      await waitFor(() => {
        expect(screen.getByText('Consultation complete')).toBeInTheDocument()
        expect(screen.getByText('We found some beautiful names')).toBeInTheDocument()
      })
    })

    it('should show view results button when complete', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({ t: 'done', agent: 'report-composer' })
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /view your personalized report/i })).toBeInTheDocument()
      })
    })

    it('should display top names from expert-selector result', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({
          t: 'result',
          agent: 'expert-selector',
          payload: {
            finalists: [
              { name: 'Luna' },
              { name: 'Aria' },
              { name: 'Oliver' },
            ],
          },
        })
        eventCallback({ t: 'done', agent: 'report-composer' })
      })

      await waitFor(() => {
        expect(screen.getByText(/Luna, Aria/)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should display error message when error event received', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({ t: 'error', msg: 'Something went wrong with processing' })
      })

      await waitFor(() => {
        expect(screen.getByText('Something went wrong')).toBeInTheDocument()
        expect(screen.getByText('Something went wrong with processing')).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate to report page when clicking view results', async () => {
      let eventCallback: (event: unknown) => void = () => {}
      vi.mocked(sse.subscribeToRun).mockImplementation((runId, cb) => {
        eventCallback = cb
        return () => {}
      })

      render(<ProcessingView runId="test-run-123" />)

      act(() => {
        eventCallback({ t: 'done', agent: 'report-composer' })
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /view your personalized report/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /view your personalized report/i }))

      expect(mockPush).toHaveBeenCalledWith('/report/test-run-123')
    })
  })
})
