import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NearMissesAccordion } from './NearMissesAccordion'

describe('NearMissesAccordion', () => {
  const mockNearMisses = [
    { name: 'Luna', reason: 'Beautiful but too popular right now' },
    { name: 'Atlas', reason: 'Strong name but might be too unusual' },
    { name: 'Ivy', reason: 'Lovely but conflicts with family name' },
  ]

  describe('Rendering', () => {
    it('should render the header', () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)
      expect(screen.getByText('Honorable Mentions')).toBeInTheDocument()
    })

    it('should render count of near misses', () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)
      expect(screen.getByText('3 lovely names that almost made the cut')).toBeInTheDocument()
    })

    it('should render "More Options" badge', () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)
      expect(screen.getByText('More Options')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should return null when nearMisses is empty', () => {
      const { container } = render(<NearMissesAccordion nearMisses={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('should return null when nearMisses is undefined', () => {
      // @ts-expect-error testing undefined prop
      const { container } = render(<NearMissesAccordion nearMisses={undefined} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Accordion Behavior', () => {
    it('should expand when trigger is clicked', async () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)

      // Click the trigger
      fireEvent.click(screen.getByText('Honorable Mentions'))

      // Content should be visible
      expect(screen.getByText('Luna')).toBeInTheDocument()
      expect(screen.getByText('Beautiful but too popular right now')).toBeInTheDocument()
    })

    it('should show all near misses when expanded', async () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)

      fireEvent.click(screen.getByText('Honorable Mentions'))

      expect(screen.getByText('Luna')).toBeInTheDocument()
      expect(screen.getByText('Atlas')).toBeInTheDocument()
      expect(screen.getByText('Ivy')).toBeInTheDocument()
    })

    it('should show all reasons when expanded', async () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)

      fireEvent.click(screen.getByText('Honorable Mentions'))

      expect(screen.getByText('Beautiful but too popular right now')).toBeInTheDocument()
      expect(screen.getByText('Strong name but might be too unusual')).toBeInTheDocument()
      expect(screen.getByText('Lovely but conflicts with family name')).toBeInTheDocument()
    })

    it('should show numbered badges when expanded', async () => {
      render(<NearMissesAccordion nearMisses={mockNearMisses} />)

      fireEvent.click(screen.getByText('Honorable Mentions'))

      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  describe('Single Near Miss', () => {
    it('should show singular count for one near miss', () => {
      const singleNearMiss = [{ name: 'Luna', reason: 'Too popular' }]
      render(<NearMissesAccordion nearMisses={singleNearMiss} />)
      expect(screen.getByText('1 lovely names that almost made the cut')).toBeInTheDocument()
    })
  })
})
