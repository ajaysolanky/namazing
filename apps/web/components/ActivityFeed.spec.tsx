import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ActivityFeed } from './ActivityFeed'
import type { ActivityEvent } from '../lib/types'

describe('ActivityFeed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Empty State', () => {
    it('should render empty state message when no events provided', () => {
      render(<ActivityFeed events={[]} />)

      expect(screen.getByText(/Activity timeline will appear/i)).toBeInTheDocument()
    })
  })

  describe('Activity Events', () => {
    it('should render activity event with agent and message', () => {
      const events: ActivityEvent[] = [
        { t: 'activity', runId: 'test-run', agent: 'Researcher', msg: 'Searching database' }
      ]
      render(<ActivityFeed events={events} />)

      expect(screen.getByText('Researcher: Searching database')).toBeInTheDocument()
    })
  })

  describe('Start Events', () => {
    it('should render start event with agent and name', () => {
      const events: ActivityEvent[] = [
        { t: 'start', runId: 'test-run', agent: 'Orchestrator', name: 'Analysis' }
      ]
      render(<ActivityFeed events={events} />)

      expect(screen.getByText('Orchestrator starting Analysis')).toBeInTheDocument()
    })
  })

  describe('Done Events', () => {
    it('should render done event with agent and name', () => {
      const events: ActivityEvent[] = [
        { t: 'done', runId: 'test-run', agent: 'Orchestrator', name: 'Analysis' }
      ]
      render(<ActivityFeed events={events} />)

      expect(screen.getByText('Orchestrator finished Analysis')).toBeInTheDocument()
    })
  })

  describe('Event Filtering', () => {
    it('should only render supported event types', () => {
      const events: ActivityEvent[] = [
        { t: 'activity', runId: 'test-run', agent: 'Visible', msg: 'Hello' },
        { t: 'log', runId: 'test-run', agent: 'Hidden', msg: 'Log message' }
      ]
      render(<ActivityFeed events={events} />)

      expect(screen.getByText('Visible: Hello')).toBeInTheDocument()
      expect(screen.queryByText(/Hidden/)).not.toBeInTheDocument()
    })
  })
})
