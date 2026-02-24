import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FinalCTA } from './FinalCTA'

describe('FinalCTA', () => {
  it('renders heading and description', () => {
    render(<FinalCTA />)
    expect(screen.getByText('Ready to meet your baby\'s name?')).toBeInTheDocument()
    expect(screen.getByText(/No commitment required/)).toBeInTheDocument()
  })

  it('renders make appointment button', () => {
    render(<FinalCTA />)
    expect(screen.getByRole('link', { name: 'Make an Appointment' })).toHaveAttribute('href', '/intake')
  })
})
