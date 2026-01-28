import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FinalistCard } from './FinalistCard'
import type { NameCard } from '@/lib/types'

const mockNameCard: NameCard = {
  name: 'Luna',
  ipa: '/ˈluːnə/',
  syllables: 2,
  meaning: 'Moon goddess',
  origins: ['Latin', 'Italian'],
}

describe('FinalistCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the name', () => {
      render(<FinalistCard name="Luna" why="Beautiful meaning" />)
      expect(screen.getByText('Luna')).toBeInTheDocument()
    })

    it('should render the why text', () => {
      render(<FinalistCard name="Luna" why="A timeless choice" />)
      expect(screen.getByText('A timeless choice')).toBeInTheDocument()
    })

    it('should render IPA pronunciation when nameCard provided', () => {
      render(<FinalistCard name="Luna" why="Test" nameCard={mockNameCard} />)
      expect(screen.getByText('/ˈluːnə/')).toBeInTheDocument()
    })

    it('should render meaning when nameCard provided', () => {
      render(<FinalistCard name="Luna" why="Test" nameCard={mockNameCard} />)
      expect(screen.getByText('Moon goddess')).toBeInTheDocument()
    })

    it('should render origins when nameCard provided', () => {
      render(<FinalistCard name="Luna" why="Test" nameCard={mockNameCard} />)
      // Origins are now shown as individual badges
      expect(screen.getByText('Latin')).toBeInTheDocument()
      expect(screen.getByText('Italian')).toBeInTheDocument()
    })
  })

  describe('Top Pick Badge', () => {
    it('should show top pick badge when index is 0', () => {
      render(<FinalistCard name="Luna" why="Test" index={0} />)
      expect(screen.getByText('Our Top Pick')).toBeInTheDocument()
    })

    it('should not show top pick badge when index is not 0', () => {
      render(<FinalistCard name="Luna" why="Test" index={1} />)
      expect(screen.queryByText('Our top pick')).not.toBeInTheDocument()
    })
  })

  describe('Combo Suggestion', () => {
    it('should render combo when provided', () => {
      const combo = {
        first: 'Stella',
        middle: 'Rose',
        why: 'Perfect flow',
      }
      render(<FinalistCard name="Stella" why="Test" combo={combo} />)

      expect(screen.getByText('Suggested Middle Name')).toBeInTheDocument()
      expect(screen.getByText('Perfect flow')).toBeInTheDocument()
      // The combo section contains "first & middle" format
      expect(screen.getByText('&')).toBeInTheDocument()
    })

    it('should not render combo section when not provided', () => {
      render(<FinalistCard name="Luna" why="Test" />)
      expect(screen.queryByText('Suggested Middle Name')).not.toBeInTheDocument()
    })
  })

  describe('View Details Button', () => {
    it('should render view details button when onViewDetails provided', () => {
      render(<FinalistCard name="Luna" why="Test" onViewDetails={() => {}} />)
      expect(screen.getByRole('button', { name: /view full details/i })).toBeInTheDocument()
    })

    it('should not render button when onViewDetails not provided', () => {
      render(<FinalistCard name="Luna" why="Test" />)
      expect(screen.queryByRole('button', { name: /view full details/i })).not.toBeInTheDocument()
    })

    it('should call onViewDetails when button clicked', () => {
      const handleViewDetails = vi.fn()
      render(<FinalistCard name="Luna" why="Test" onViewDetails={handleViewDetails} />)

      fireEvent.click(screen.getByRole('button', { name: /view full details/i }))

      expect(handleViewDetails).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle nameCard without meaning', () => {
      const nameCard = { ...mockNameCard, meaning: undefined }
      render(<FinalistCard name="Luna" why="Test" nameCard={nameCard} />)
      expect(screen.queryByText('Meaning')).not.toBeInTheDocument()
    })

    it('should handle nameCard without origins', () => {
      const nameCard = { ...mockNameCard, origins: undefined }
      render(<FinalistCard name="Luna" why="Test" nameCard={nameCard} />)
      expect(screen.queryByText('Origin')).not.toBeInTheDocument()
    })

    it('should handle empty origins array', () => {
      const nameCard = { ...mockNameCard, origins: [] }
      render(<FinalistCard name="Luna" why="Test" nameCard={nameCard} />)
      expect(screen.queryByText('Origin')).not.toBeInTheDocument()
    })
  })
})
