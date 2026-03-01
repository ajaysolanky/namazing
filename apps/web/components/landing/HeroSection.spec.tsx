import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders headline and description', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { name: /Find the perfect/ })).toBeInTheDocument()
    expect(screen.getByText(/Answer a short baby-name intake/)).toBeInTheDocument()
  })

  it('renders start consultation CTA', () => {
    render(<HeroSection />)
    const cta = screen.getByRole('link', { name: 'Start Consultation' })
    expect(cta).toHaveAttribute('href', '/intake')
  })

  it('renders top match preview content', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Top match preview/i)).toBeInTheDocument()
    expect(screen.getAllByText('Amara').length).toBeGreaterThan(0)
    expect(screen.getByText(/Graceful, cross-cultural/)).toBeInTheDocument()
  })
})
