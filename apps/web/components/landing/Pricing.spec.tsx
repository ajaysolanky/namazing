import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Pricing } from './Pricing'

describe('Pricing', () => {
  describe('Section Structure', () => {
    it('should have id="pricing" on section', () => {
      const { container } = render(<Pricing />)
      const section = container.querySelector('section#pricing')
      expect(section).toBeInTheDocument()
    })

    it('should render heading "Simple pricing"', () => {
      render(<Pricing />)
      expect(screen.getByText('Simple pricing')).toBeInTheDocument()
    })

    it('should render section description', () => {
      render(<Pricing />)
      expect(screen.getByText(/Get started for free. No credit card required/)).toBeInTheDocument()
    })
  })

  describe('Pricing Card', () => {
    it('should render "Early Access" badge', () => {
      render(<Pricing />)
      expect(screen.getByText('Early Access')).toBeInTheDocument()
    })

    it('should render "$0" price with struck-through "$49"', () => {
      render(<Pricing />)
      expect(screen.getByText('$0')).toBeInTheDocument()
      expect(screen.getByText('$49')).toBeInTheDocument()
    })

    it('should render early access pricing description', () => {
      render(<Pricing />)
      expect(screen.getByText(/Free during early access/)).toBeInTheDocument()
    })
  })

  describe('Feature List', () => {
    it('should render "Full 5-stage AI consultation pipeline" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Full 5-stage AI consultation pipeline')).toBeInTheDocument()
    })

    it('should render "Deep name research with cultural context" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Deep name research with cultural context')).toBeInTheDocument()
    })

    it('should render "Curated shortlist of 8-12 finalists" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Curated shortlist of 8-12 finalists')).toBeInTheDocument()
    })

    it('should render "Middle name pairing suggestions" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Middle name pairing suggestions')).toBeInTheDocument()
    })

    it('should render "Personalized consultation report" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Personalized consultation report')).toBeInTheDocument()
    })

    it('should render "Unlimited consultations" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Unlimited consultations')).toBeInTheDocument()
    })

    it('should render "Dashboard with run history" feature', () => {
      render(<Pricing />)
      expect(screen.getByText('Dashboard with run history')).toBeInTheDocument()
    })

    it('should render all 7 features', () => {
      render(<Pricing />)
      const features = [
        'Full 5-stage AI consultation pipeline',
        'Deep name research with cultural context',
        'Curated shortlist of 8-12 finalists',
        'Middle name pairing suggestions',
        'Personalized consultation report',
        'Unlimited consultations',
        'Dashboard with run history',
      ]
      features.forEach((feature) => {
        expect(screen.getByText(feature)).toBeInTheDocument()
      })
    })
  })

  describe('CTA Button', () => {
    it('should render "Get started free" CTA button linking to /sign-up', () => {
      render(<Pricing />)
      const ctaLink = screen.getByRole('link', { name: 'Get started free' })
      expect(ctaLink).toBeInTheDocument()
      expect(ctaLink).toHaveAttribute('href', '/sign-up')
    })
  })
})
