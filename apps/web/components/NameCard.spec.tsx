import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NameCard } from './NameCard'
import type { NameCard as NameCardType } from '@namazing/schemas'

// Mock data based on usage in component
const mockCard: NameCardType = {
  name: 'Aria',
  ipa: '/ˈɑːriə/',
  syllables: 3,
  meaning: 'Air; song or melody',
  combo_suggestions: [
    { first: 'Aria', middle: 'Rose', why: 'Classic combination' },
    { first: 'Aria', middle: 'Grace', why: 'Flows well' }
  ],
  research_log: [
    'Checked popularity ranking',
    'Verified cultural associations'
  ]
}

describe('NameCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render the name', () => {
      render(<NameCard card={mockCard} />)
      expect(screen.getByText('Aria')).toBeInTheDocument()
    })

    it('should render the IPA pronunciation', () => {
      render(<NameCard card={mockCard} />)
      expect(screen.getByText('/ˈɑːriə/')).toBeInTheDocument()
    })

    it('should render the syllable count', () => {
      render(<NameCard card={mockCard} />)
      expect(screen.getByText('3 syllables')).toBeInTheDocument()
    })

    it('should render the meaning when provided', () => {
      render(<NameCard card={mockCard} />)
      expect(screen.getByText('Air; song or melody')).toBeInTheDocument()
    })
  })

  describe('Combo Suggestions', () => {
    it('should render combo suggestions when provided', () => {
      render(<NameCard card={mockCard} />)
      expect(screen.getByText('Aria Rose')).toBeInTheDocument()
      expect(screen.getByText('Classic combination')).toBeInTheDocument()
    })
  })

  describe('Research Log', () => {
    it('should hide research log initially', () => {
      render(<NameCard card={mockCard} />)
      expect(screen.queryByText('Checked popularity ranking')).not.toBeInTheDocument()
    })

    it('should show research log when toggle button is clicked', () => {
      render(<NameCard card={mockCard} />)

      fireEvent.click(screen.getByRole('button', { name: /show research log/i }))

      expect(screen.getByRole('button', { name: /hide research log/i })).toBeInTheDocument()
      expect(screen.getByText('• Checked popularity ranking')).toBeInTheDocument()
      expect(screen.getByText('• Verified cultural associations')).toBeInTheDocument()
    })

    it('should hide research log when toggle button is clicked again', () => {
      render(<NameCard card={mockCard} />)

      fireEvent.click(screen.getByRole('button', { name: /show research log/i }))
      fireEvent.click(screen.getByRole('button', { name: /hide research log/i }))

      expect(screen.queryByText('• Checked popularity ranking')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should render without meaning when not provided', () => {
      const minimalCard: NameCardType = {
        name: 'Leo',
        ipa: '/liːoʊ/',
        syllables: 2
      }

      render(<NameCard card={minimalCard} />)

      expect(screen.getByText('Leo')).toBeInTheDocument()
    })

    it('should not render combo list when no suggestions provided', () => {
      const minimalCard: NameCardType = {
        name: 'Leo',
        ipa: '/liːoʊ/',
        syllables: 2
      }

      render(<NameCard card={minimalCard} />)

      expect(screen.queryByRole('list')).not.toBeInTheDocument()
    })
  })
})
