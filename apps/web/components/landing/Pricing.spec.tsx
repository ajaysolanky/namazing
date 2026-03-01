import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Pricing } from './Pricing'

describe('Pricing', () => {
  it('renders pricing section and core copy', () => {
    const { container } = render(<Pricing />)
    expect(container.querySelector('section#pricing')).toBeInTheDocument()
    expect(screen.getByText("Start free while we're in early access.")).toBeInTheDocument()
    expect(screen.getByText(/No credit card required/)).toBeInTheDocument()
  })

  it('renders early access pricing details', () => {
    render(<Pricing />)
    expect(screen.getByText('Early access')).toBeInTheDocument()
    expect(screen.getByText('Full 5-stage AI consultation pipeline')).toBeInTheDocument()
    expect(screen.getByText('Curated shortlist of 8-12 finalists')).toBeInTheDocument()
  })

  it('renders feature list and CTA', () => {
    render(<Pricing />)
    expect(screen.getByText('Full 5-stage AI consultation pipeline')).toBeInTheDocument()
    expect(screen.getByText('Middle name pairing suggestions')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start Consultation' })).toHaveAttribute('href', '/intake')
  })
})
