import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  it('renders headline and description', () => {
    render(<HeroSection />)
    expect(screen.getByRole('heading', { name: /Find the perfect/ })).toBeInTheDocument()
    expect(screen.getByText(/Skip the overwhelming lists/)).toBeInTheDocument()
  })

  it('renders start consultation CTA', () => {
    render(<HeroSection />)
    const cta = screen.getByRole('link', { name: 'Start Consultation' })
    expect(cta).toHaveAttribute('href', '/intake')
  })

  it('renders top match dossier card content', () => {
    render(<HeroSection />)
    expect(screen.getByText('Top Match')).toBeInTheDocument()
    expect(screen.getByText('Elara')).toBeInTheDocument()
    expect(screen.getByText('Why it fits')).toBeInTheDocument()
  })
})
