import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProgressTracker } from './ProgressTracker'
import type { ActivityEvent } from '../lib/types'

describe('ProgressTracker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all step labels', () => {
      render(<ProgressTracker events={[]} />)

      expect(screen.getByText('Parser')).toBeInTheDocument()
      expect(screen.getByText('Generator')).toBeInTheDocument()
      expect(screen.getByText('Research')).toBeInTheDocument()
      expect(screen.getByText('Selector')).toBeInTheDocument()
      expect(screen.getByText('Report')).toBeInTheDocument()
    })

    it('should render without crashing when events array is empty', () => {
      render(<ProgressTracker events={[]} />)

      expect(screen.getByText('Parser')).toBeInTheDocument()
    })
  })

  describe('Event Handling', () => {
    it('should render without crashing when start event is provided', () => {
      const events: ActivityEvent[] = [
        { t: 'start', runId: 'test-run', agent: 'generator', name: 'Generating names' }
      ]
      render(<ProgressTracker events={events} />)

      expect(screen.getByText('Generator')).toBeInTheDocument()
    })

    it('should render without crashing when done event is provided', () => {
      const events: ActivityEvent[] = [
        { t: 'done', runId: 'test-run', agent: 'brief-parser' }
      ]
      render(<ProgressTracker events={events} />)

      expect(screen.getByText('Parser')).toBeInTheDocument()
    })

    it('should render without crashing when multiple events are provided', () => {
      const events: ActivityEvent[] = [
        { t: 'done', runId: 'test-run', agent: 'brief-parser' },
        { t: 'start', runId: 'test-run', agent: 'generator', name: 'Generating' },
        { t: 'activity', runId: 'test-run', agent: 'generator', msg: 'Working...' }
      ]
      render(<ProgressTracker events={events} />)

      expect(screen.getByText('Parser')).toBeInTheDocument()
      expect(screen.getByText('Generator')).toBeInTheDocument()
    })
  })
})
