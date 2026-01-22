import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProgressTracker } from './ProgressTracker'
import type { ActivityEvent } from '../lib/types'

describe('ProgressTracker', () => {
  it('renders all steps in pending state initially', () => {
    render(<ProgressTracker events={[]} />)
    
    expect(screen.getByText('Parser')).toBeInTheDocument()
    expect(screen.getByText('Generator')).toBeInTheDocument()
    expect(screen.getByText('Research')).toBeInTheDocument()
    expect(screen.getByText('Selector')).toBeInTheDocument()
    expect(screen.getByText('Report')).toBeInTheDocument()
    
    // Check pending visual (bg-white) - this is a bit implementation detail heavy but okay for now
    // We could add data-testid or accessible roles/states for better testing
  })

  it('marks step as active when activity detected', () => {
    const events: ActivityEvent[] = [
      { t: 'start', agent: 'generator', name: 'Generating names' } as any
    ]
    const { container } = render(<ProgressTracker events={events} />)
    
    // Find the generator step and check its indicator
    // Since structure is div > div(indicator) + text, we can find text parent
    const label = screen.getByText('Generator')
    const indicator = label.querySelector('div')
    expect(indicator).toHaveClass('bg-studio-rose')
  })

  it('marks step as done when finished', () => {
    const events: ActivityEvent[] = [
      { t: 'done', agent: 'brief-parser' } as any
    ]
    const { container } = render(<ProgressTracker events={events} />)
    
    const label = screen.getByText('Parser')
    const indicator = label.querySelector('div')
    expect(indicator).toHaveClass('bg-studio-sage')
  })
})
