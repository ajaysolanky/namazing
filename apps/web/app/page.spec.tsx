import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock all landing components
vi.mock('@/components/landing/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero</div>,
}))
vi.mock('@/components/landing/HowItWorks', () => ({
  HowItWorks: () => <div data-testid="how-it-works">HowItWorks</div>,
}))
vi.mock('@/components/landing/Testimonials', () => ({
  Testimonials: () => <div data-testid="testimonials">Testimonials</div>,
}))
vi.mock('@/components/landing/FAQ', () => ({
  FAQ: () => <div data-testid="faq">FAQ</div>,
}))
vi.mock('@/components/landing/Pricing', () => ({
  Pricing: () => <div data-testid="pricing">Pricing</div>,
}))
vi.mock('@/components/landing/FinalCTA', () => ({
  FinalCTA: () => <div data-testid="final-cta">FinalCTA</div>,
}))

import Page from './page'

describe('Landing Page', () => {
  it('should render all landing sections', () => {
    render(<Page />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    expect(screen.getByTestId('pricing')).toBeInTheDocument()
    expect(screen.getByTestId('faq')).toBeInTheDocument()
    expect(screen.getByTestId('final-cta')).toBeInTheDocument()
  })

  it('should render header and footer', () => {
    render(<Page />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('should render main content area', () => {
    render(<Page />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
