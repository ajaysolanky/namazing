import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ShortlistPanel } from './ShortlistPanel'

const mockSelection = {
  finalists: [
    {
      name: 'Luna',
      why: 'Fits the celestial theme perfect.',
      combo: { first: 'Luna', middle: 'Belle', why: 'Beautiful moon' }
    },
    {
      name: 'Nova',
      why: 'Modern and energetic.'
    }
  ],
  near_misses: [
    { name: 'Stella', reason: 'Too popular' }
  ]
}

describe('ShortlistPanel', () => {
  it('renders empty state when no selection provided', () => {
    render(<ShortlistPanel />)
    expect(screen.getByText(/Finalists will appear once/i)).toBeInTheDocument()
  })

  it('renders finalists correctly', () => {
    render(<ShortlistPanel selection={mockSelection} />)
    
    expect(screen.getByText('Shortlist')).toBeInTheDocument()
    expect(screen.getByText('Luna')).toBeInTheDocument()
    expect(screen.getByText('Fits the celestial theme perfect.')).toBeInTheDocument()
    
    expect(screen.getByText('Nova')).toBeInTheDocument()
    expect(screen.getByText('Modern and energetic.')).toBeInTheDocument()
  })

  it('renders combo details for finalists', () => {
    render(<ShortlistPanel selection={mockSelection} />)
    expect(screen.getByText('Luna Belle')).toBeInTheDocument()
    expect(screen.getByText(/Beautiful moon/)).toBeInTheDocument()
  })

  it('renders near misses', () => {
    render(<ShortlistPanel selection={mockSelection} />)
    
    expect(screen.getByText('Near Misses')).toBeInTheDocument()
    expect(screen.getByText('Stella')).toBeInTheDocument()
    expect(screen.getByText(/Too popular/)).toBeInTheDocument()
  })
})
