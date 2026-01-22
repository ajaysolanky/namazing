import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NameCard } from './NameCard'

// Mock data based on usage in component
const mockCard = {
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
  it('renders basic name information', () => {
    render(<NameCard card={mockCard} />)
    
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText('/ˈɑːriə/')).toBeInTheDocument()
    expect(screen.getByText('3 syllables')).toBeInTheDocument()
    expect(screen.getByText('Air; song or melody')).toBeInTheDocument()
  })

  it('renders combo suggestions', () => {
    render(<NameCard card={mockCard} />)
    
    expect(screen.getByText('Aria Rose')).toBeInTheDocument()
    expect(screen.getByText('Classic combination')).toBeInTheDocument()
  })

  it('toggles research log visibility', () => {
    render(<NameCard card={mockCard} />)
    
    // Log should be hidden initially
    expect(screen.queryByText('Checked popularity ranking')).not.toBeInTheDocument()
    const toggleButton = screen.getByRole('button', { name: /show research log/i })
    
    // Open log
    fireEvent.click(toggleButton)
    expect(screen.getByRole('button', { name: /hide research log/i })).toBeInTheDocument()
    expect(screen.getByText('• Checked popularity ranking')).toBeInTheDocument()
    expect(screen.getByText('• Verified cultural associations')).toBeInTheDocument()
    
    // Close log
    fireEvent.click(screen.getByRole('button', { name: /hide research log/i }))
    expect(screen.queryByText('• Checked popularity ranking')).not.toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const minimalCard = {
      name: 'Leo',
      ipa: '/liːoʊ/',
      syllables: 2
    }
    
    render(<NameCard card={minimalCard as any} />)
    
    expect(screen.getByText('Leo')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument() // No combo list
  })
})
