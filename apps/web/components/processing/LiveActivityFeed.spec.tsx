import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LiveActivityFeed } from './LiveActivityFeed'
import type { ActivityEvent } from '@/lib/types'

const createEvent = (overrides: Partial<ActivityEvent>): ActivityEvent => ({
  t: 'activity',
  agent: 'brief-parser',
  msg: 'Processing...',
  ...overrides,
} as ActivityEvent)

describe('LiveActivityFeed', () => {
  describe('Rendering', () => {
    it('should render loading state when no events', () => {
      render(<LiveActivityFeed events={[]} />)
      expect(screen.getByText('Getting everything ready...')).toBeInTheDocument()
    })

    it('should render activity events', () => {
      const events = [
        createEvent({ t: 'activity', agent: 'brief-parser', msg: 'Parsing brief' }),
      ]
      render(<LiveActivityFeed events={events} />)

      // The message should be humanized (Parsing -> Reading)
      expect(screen.getByText('Reading brief')).toBeInTheDocument()
    })

    it('should render start events', () => {
      const events = [
        createEvent({ t: 'start', agent: 'brief-parser' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Starting to understand your preferences...')).toBeInTheDocument()
    })

    it('should render done events', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Got it!')).toBeInTheDocument()
    })

    it('should render log events', () => {
      const events = [
        createEvent({ t: 'log', agent: 'brief-parser', msg: 'Custom log message' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Custom log message')).toBeInTheDocument()
    })
  })

  describe('Message Humanization', () => {
    it('should humanize generator start events with name', () => {
      const events = [
        createEvent({ t: 'start', agent: 'generator', name: 'Luna' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Looking into Luna...')).toBeInTheDocument()
    })

    it('should humanize researcher start events with name', () => {
      const events = [
        createEvent({ t: 'start', agent: 'researcher', name: 'Oliver' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Researching Oliver...')).toBeInTheDocument()
    })

    it('should humanize expert-selector start events', () => {
      const events = [
        createEvent({ t: 'start', agent: 'expert-selector' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Curating your shortlist...')).toBeInTheDocument()
    })

    it('should humanize report-composer start events', () => {
      const events = [
        createEvent({ t: 'start', agent: 'report-composer' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Preparing your personalized report...')).toBeInTheDocument()
    })

    it('should humanize activity messages', () => {
      const events = [
        createEvent({ t: 'activity', agent: 'generator', msg: 'Generating names' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Finding names')).toBeInTheDocument()
    })

    it('should humanize done events with name', () => {
      const events = [
        createEvent({ t: 'done', agent: 'generator', name: 'Aria' }),
      ]
      render(<LiveActivityFeed events={events} />)

      expect(screen.getByText('Found Aria')).toBeInTheDocument()
    })
  })

  describe('Max Items', () => {
    it('should limit displayed items to maxItems prop', () => {
      const events = Array.from({ length: 20 }, (_, i) =>
        createEvent({ t: 'activity', agent: 'generator', msg: `Message ${i}` })
      )
      render(<LiveActivityFeed events={events} maxItems={5} />)

      // Should only show last 5 items
      expect(screen.queryByText('Message 14')).not.toBeInTheDocument()
      expect(screen.getByText('Message 19')).toBeInTheDocument()
    })

    it('should use default maxItems of 15', () => {
      const events = Array.from({ length: 20 }, (_, i) =>
        createEvent({ t: 'activity', agent: 'generator', msg: `Item ${i}` })
      )
      render(<LiveActivityFeed events={events} />)

      // Should show last 15 items
      expect(screen.queryByText('Item 4')).not.toBeInTheDocument()
      expect(screen.getByText('Item 19')).toBeInTheDocument()
    })
  })

  describe('Event Filtering', () => {
    it('should filter out partial events', () => {
      const events = [
        createEvent({ t: 'partial', agent: 'generator', field: 'test', value: {} }),
        createEvent({ t: 'activity', agent: 'generator', msg: 'Working' }),
      ]
      render(<LiveActivityFeed events={events} />)

      // Only activity should be shown
      expect(screen.getByText('Working')).toBeInTheDocument()
    })

    it('should filter out result events', () => {
      const events = [
        createEvent({ t: 'result', agent: 'report-composer', payload: {} }),
        createEvent({ t: 'done', agent: 'report-composer' }),
      ]
      render(<LiveActivityFeed events={events} />)

      // Only done should be shown
      expect(screen.getByText('Report complete!')).toBeInTheDocument()
    })
  })

  describe('Visual Indicators', () => {
    it('should show checkmark icon for done events', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
      ]
      const { container } = render(<LiveActivityFeed events={events} />)

      const checkmark = container.querySelector('path[d="M5 13l4 4L19 7"]')
      expect(checkmark).toBeInTheDocument()
    })

    it('should apply done styling', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
      ]
      const { container } = render(<LiveActivityFeed events={events} />)

      const doneEntry = container.querySelector('.bg-studio-sage\\/20')
      expect(doneEntry).toBeInTheDocument()
    })

    it('should apply start styling', () => {
      const events = [
        createEvent({ t: 'start', agent: 'brief-parser' }),
      ]
      const { container } = render(<LiveActivityFeed events={events} />)

      const startEntry = container.querySelector('.bg-white\\/80')
      expect(startEntry).toBeInTheDocument()
    })
  })
})
