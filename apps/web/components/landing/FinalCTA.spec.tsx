import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FinalCTA } from './FinalCTA'

describe('FinalCTA', () => {
  it('renders heading and description', () => {
    render(<FinalCTA />)
    expect(screen.getByText('Ready to meet your baby\'s name?')).toBeInTheDocument()
    expect(screen.getByText(/No commitment required/)).toBeInTheDocument()
  })

  it('renders start consultation button', () => {
    render(<FinalCTA />)
    expect(screen.getByRole('link', { name: 'Start Consultation' })).toHaveAttribute('href', '/intake')
  })
})
