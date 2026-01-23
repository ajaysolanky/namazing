import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ComboShowcase } from './ComboShowcase'

describe('ComboShowcase', () => {
  const mockCombos = [
    { first: 'Luna', middle: 'Rose', why: 'Beautiful celestial pairing' },
    { first: 'Oliver', middle: 'James', why: 'Classic combination' },
  ]

  describe('Rendering', () => {
    it('should render section header', () => {
      render(<ComboShowcase combos={mockCombos} />)
      expect(screen.getByText('Perfect Pairings')).toBeInTheDocument()
    })

    it('should render description text', () => {
      render(<ComboShowcase combos={mockCombos} />)
      expect(screen.getByText(/combinations that flow beautifully/i)).toBeInTheDocument()
    })

    it('should render badge', () => {
      render(<ComboShowcase combos={mockCombos} />)
      expect(screen.getByText('First + Middle')).toBeInTheDocument()
    })
  })

  describe('Combo Cards', () => {
    it('should render all combos', () => {
      render(<ComboShowcase combos={mockCombos} />)

      expect(screen.getByText('Luna')).toBeInTheDocument()
      expect(screen.getByText('Rose')).toBeInTheDocument()
      expect(screen.getByText('Oliver')).toBeInTheDocument()
      expect(screen.getByText('James')).toBeInTheDocument()
    })

    it('should render combo reasons', () => {
      render(<ComboShowcase combos={mockCombos} />)

      expect(screen.getByText('Beautiful celestial pairing')).toBeInTheDocument()
      expect(screen.getByText('Classic combination')).toBeInTheDocument()
    })

    it('should render full name preview', () => {
      render(<ComboShowcase combos={mockCombos} />)

      expect(screen.getByText('Luna Rose')).toBeInTheDocument()
      expect(screen.getByText('Oliver James')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should return null when combos is empty', () => {
      const { container } = render(<ComboShowcase combos={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('should return null when combos is undefined', () => {
      // @ts-expect-error testing undefined prop
      const { container } = render(<ComboShowcase combos={undefined} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Multiple Combos', () => {
    it('should render three combos in grid', () => {
      const threeCombos = [
        { first: 'Luna', middle: 'Rose', why: 'Reason 1' },
        { first: 'Oliver', middle: 'James', why: 'Reason 2' },
        { first: 'Aria', middle: 'Grace', why: 'Reason 3' },
      ]
      render(<ComboShowcase combos={threeCombos} />)

      expect(screen.getByText('Luna Rose')).toBeInTheDocument()
      expect(screen.getByText('Oliver James')).toBeInTheDocument()
      expect(screen.getByText('Aria Grace')).toBeInTheDocument()
    })
  })
})
