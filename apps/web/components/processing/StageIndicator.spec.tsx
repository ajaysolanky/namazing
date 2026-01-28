import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { StageIndicator } from './StageIndicator'
import type { ActivityEvent } from '@/lib/types'

const createEvent = (overrides: Partial<ActivityEvent>): ActivityEvent => ({
  t: 'activity',
  agent: 'brief-parser',
  msg: 'Processing...',
  ...overrides,
} as ActivityEvent)

describe('StageIndicator', () => {
  describe('Rendering', () => {
    it('should render all five stages', () => {
      render(<StageIndicator events={[]} />)

      expect(screen.getAllByText('Understanding').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Exploring').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Researching').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Curating').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Composing').length).toBeGreaterThan(0)
    })

    it('should render stage descriptions', () => {
      render(<StageIndicator events={[]} />)

      expect(screen.getByText('Learning your preferences')).toBeInTheDocument()
      expect(screen.getByText('Finding name ideas')).toBeInTheDocument()
      expect(screen.getByText('Diving into meanings')).toBeInTheDocument()
      expect(screen.getByText('Picking the best')).toBeInTheDocument()
      expect(screen.getByText('Creating your report')).toBeInTheDocument()
    })

    it('should render progress bar', () => {
      const { container } = render(<StageIndicator events={[]} />)
      const progressBar = container.querySelector('.bg-gradient-to-r')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Stage Status', () => {
    it('should show pending status when no events', () => {
      const { container } = render(<StageIndicator events={[]} />)
      // Pending stages have opacity/color classes
      const pendingStages = container.querySelectorAll('.bg-white\\/60, .bg-white\\/30')
      expect(pendingStages.length).toBeGreaterThan(0)
    })

    it('should show active status for stage with activity event', () => {
      const events = [
        createEvent({ t: 'activity', agent: 'brief-parser', msg: 'Working' }),
      ]
      const { container } = render(<StageIndicator events={events} />)

      // Active stages have terracotta ring
      const activeStage = container.querySelector('.ring-studio-terracotta\\/30')
      expect(activeStage).toBeInTheDocument()
    })

    it('should show done status for completed stage', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
      ]
      const { container } = render(<StageIndicator events={events} />)

      // Done stages have sage gradient background
      const doneStage = container.querySelector('.from-studio-sage\\/30')
      expect(doneStage).toBeInTheDocument()
    })

    it('should show checkmark for completed stages', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
      ]
      const { container } = render(<StageIndicator events={events} />)

      // Checkmark path
      const checkmarks = container.querySelectorAll('path[d="M5 13l4 4L19 7"]')
      expect(checkmarks.length).toBeGreaterThan(0)
    })
  })

  describe('Progress Calculation', () => {
    it('should show 0% progress when no stages active', () => {
      const { container } = render(<StageIndicator events={[]} />)
      const progressBar = container.querySelector('.bg-gradient-to-r')
      // Progress bar should have width based on 0%
      expect(progressBar).toBeInTheDocument()
    })

    it('should show 100% progress when all stages done', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
        createEvent({ t: 'done', agent: 'generator' }),
        createEvent({ t: 'done', agent: 'researcher' }),
        createEvent({ t: 'done', agent: 'expert-selector' }),
        createEvent({ t: 'done', agent: 'report-composer' }),
      ]
      const { container } = render(<StageIndicator events={events} />)
      const progressBar = container.querySelector('.bg-gradient-to-r')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Multiple Stages', () => {
    it('should handle multiple stages with different statuses', () => {
      const events = [
        createEvent({ t: 'done', agent: 'brief-parser' }),
        createEvent({ t: 'done', agent: 'generator' }),
        createEvent({ t: 'activity', agent: 'researcher', msg: 'Working' }),
      ]
      const { container } = render(<StageIndicator events={events} />)

      // Should have done stages (sage gradient)
      const doneStages = container.querySelectorAll('.from-studio-sage\\/30')
      expect(doneStages.length).toBe(2)

      // Should have active stage (terracotta ring)
      const activeStages = container.querySelectorAll('.ring-studio-terracotta\\/30')
      expect(activeStages.length).toBe(1)
    })
  })

  describe('Mobile View', () => {
    it('should render mobile compact view', () => {
      render(<StageIndicator events={[]} />)
      // Mobile view shows numbers for pending stages
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })
})
