import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Pricing } from './Pricing'

describe('Pricing', () => {
  it('renders pricing section and core copy', () => {
    const { container } = render(<Pricing />)
    expect(container.querySelector('section#pricing')).toBeInTheDocument()
    expect(screen.getByText('Simple pricing')).toBeInTheDocument()
    expect(screen.getByText(/Get started for free/)).toBeInTheDocument()
  })

  it('renders early access pricing details', () => {
    render(<Pricing />)
    expect(screen.getByText('Early Access')).toBeInTheDocument()
    expect(screen.getByText('$49')).toBeInTheDocument()
    expect(screen.getByText('$0')).toBeInTheDocument()
  })

  it('renders feature list and CTA', () => {
    render(<Pricing />)
    expect(screen.getByText('Full 5-stage AI consultation pipeline')).toBeInTheDocument()
    expect(screen.getByText('Dashboard with run history')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start Consultation' })).toHaveAttribute('href', '/intake')
  })
})
