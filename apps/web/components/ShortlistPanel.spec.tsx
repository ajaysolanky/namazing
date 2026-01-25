import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShortlistPanel } from './ShortlistPanel'
import type { ExpertSelection } from '../lib/types'

const mockSelection: ExpertSelection = {
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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Empty State', () => {
    it('should render empty state when no selection provided', () => {
      render(<ShortlistPanel />)

      expect(screen.getByText(/Finalists will appear once/i)).toBeInTheDocument()
    })
  })

  describe('Finalists', () => {
    it('should render the shortlist heading', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText('Shortlist')).toBeInTheDocument()
    })

    it('should render finalist names', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText('Luna')).toBeInTheDocument()
      expect(screen.getByText('Nova')).toBeInTheDocument()
    })

    it('should render finalist explanations', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText('Fits the celestial theme perfect.')).toBeInTheDocument()
      expect(screen.getByText('Modern and energetic.')).toBeInTheDocument()
    })
  })

  describe('Combo Suggestions', () => {
    it('should render combo name when provided', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText('Luna Belle')).toBeInTheDocument()
    })

    it('should render combo explanation when provided', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText(/Beautiful moon/)).toBeInTheDocument()
    })
  })

  describe('Near Misses', () => {
    it('should render near misses section', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText('Near Misses')).toBeInTheDocument()
    })

    it('should render near miss names and reasons', () => {
      render(<ShortlistPanel selection={mockSelection} />)

      expect(screen.getByText('Stella')).toBeInTheDocument()
      expect(screen.getByText(/Too popular/)).toBeInTheDocument()
    })
  })
})
