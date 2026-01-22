import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ActivityFeed } from './ActivityFeed'
import type { ActivityEvent } from '../lib/types'

describe('ActivityFeed', () => {
  it('renders empty state message when no relevant events', () => {
    render(<ActivityFeed events={[]} />)
    expect(screen.getByText(/Activity timeline will appear/i)).toBeInTheDocument()
  })

  it('renders activity events correctly', () => {
    const events: ActivityEvent[] = [
      { t: 'activity', agent: 'Researcher', msg: 'Searching database' } as any
    ]
    render(<ActivityFeed events={events} />)
    expect(screen.getByText('Researcher: Searching database')).toBeInTheDocument()
  })

  it('renders start events correctly', () => {
    const events: ActivityEvent[] = [
      { t: 'start', agent: 'Orchestrator', name: 'Analysis' } as any
    ]
    render(<ActivityFeed events={events} />)
    expect(screen.getByText('Orchestrator starting Analysis')).toBeInTheDocument()
  })

  it('renders done events correctly', () => {
    const events: ActivityEvent[] = [
      { t: 'done', agent: 'Orchestrator', name: 'Analysis' } as any
    ]
    render(<ActivityFeed events={events} />)
    expect(screen.getByText('Orchestrator finished Analysis')).toBeInTheDocument()
  })

  it('filters out ignored event types', () => {
    const events: ActivityEvent[] = [
      { t: 'activity', agent: 'Visible', msg: 'Hello' } as any,
      { t: 'other_type', agent: 'Hidden' } as any 
    ]
    render(<ActivityFeed events={events} />)
    expect(screen.getByText('Visible: Hello')).toBeInTheDocument()
    expect(screen.queryByText(/Hidden/)).not.toBeInTheDocument()
  })
})
