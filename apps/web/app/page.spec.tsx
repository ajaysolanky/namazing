import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock all landing components
vi.mock('@/components/landing/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section">Hero</div>,
}))
vi.mock('@/components/landing/HowItWorks', () => ({
  HowItWorks: () => <div data-testid="how-it-works">HowItWorks</div>,
}))
vi.mock('@/components/landing/SampleReportPreview', () => ({
  SampleReportPreview: () => <div data-testid="sample-report-preview">SampleReportPreview</div>,
}))
vi.mock('@/components/landing/ValueProposition', () => ({
  ValueProposition: () => <div data-testid="value-proposition">ValueProposition</div>,
}))
vi.mock('@/components/landing/DarkTestimonial', () => ({
  DarkTestimonial: () => <div data-testid="testimonials">DarkTestimonial</div>,
}))
vi.mock('@/components/landing/FAQ', () => ({
  FAQ: () => <div data-testid="faq">FAQ</div>,
}))

import Page from './page'

describe('Landing Page', () => {
  it('should render all landing sections', () => {
    render(<Page />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('sample-report-preview')).toBeInTheDocument()
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument()
    expect(screen.getByTestId('value-proposition')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    expect(screen.getByTestId('faq')).toBeInTheDocument()
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
