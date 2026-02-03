import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  describe('Badge and Hero Text', () => {
    it('should render the badge with "AI-Powered Baby Name Consultation"', () => {
      render(<HeroSection />)
      expect(screen.getByText('AI-Powered Baby Name Consultation')).toBeInTheDocument()
    })

    it('should render the headline text "Find the"', () => {
      render(<HeroSection />)
      expect(screen.getByText('Find')).toBeInTheDocument()
      expect(screen.getByText('the')).toBeInTheDocument()
    })

    it('should render the headline text "perfect name"', () => {
      render(<HeroSection />)
      expect(screen.getByText('perfect name')).toBeInTheDocument()
    })

    it('should render the headline text "for your little one"', () => {
      render(<HeroSection />)
      expect(screen.getByText('for your little one')).toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('should render the description about AI-powered consultation', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Our AI-powered consultation combines deep research, cultural context/)).toBeInTheDocument()
    })
  })

  describe('CTA Button', () => {
    it('should render "Get started free" CTA button', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByRole('link', { name: 'Get started free' })
      expect(buttons.length).toBeGreaterThan(0)
      expect(buttons[0]).toHaveAttribute('href', '/sign-up')
    })

    it('should render subtitle "Free — create your account in seconds"', () => {
      render(<HeroSection />)
      expect(screen.getByText('Free — create your account in seconds')).toBeInTheDocument()
    })
  })

  describe('Social Proof', () => {
    it('should render social proof "Trusted by growing families"', () => {
      render(<HeroSection />)
      expect(screen.getByText('Trusted by growing families')).toBeInTheDocument()
    })
  })

  describe('Sample Name Preview Cards', () => {
    it('should render "Sample from our curated collections" text', () => {
      render(<HeroSection />)
      expect(screen.getByText('Sample from our curated collections')).toBeInTheDocument()
    })

    it('should render Amara name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText('Amara')).toBeInTheDocument()
      expect(screen.getByText('Grace, eternal')).toBeInTheDocument()
    })

    it('should render Rowan name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText('Rowan')).toBeInTheDocument()
      expect(screen.getByText('Little red one')).toBeInTheDocument()
    })

    it('should render Kenji name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText('Kenji')).toBeInTheDocument()
      expect(screen.getByText('Intelligent second son')).toBeInTheDocument()
    })

    it('should render Zara name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText('Zara')).toBeInTheDocument()
      expect(screen.getByText('Blooming flower')).toBeInTheDocument()
    })
  })
})
