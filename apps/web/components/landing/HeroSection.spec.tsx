import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HeroSection } from './HeroSection'

describe('HeroSection', () => {
  describe('Badge and Hero Text', () => {
    it('should render the badge with "Free During Early Access"', () => {
      render(<HeroSection />)
      expect(screen.getByText('Free During Early Access')).toBeInTheDocument()
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
    it('should render the description about family story and heritage', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Tell us your family's story and heritage/)).toBeInTheDocument()
    })
  })

  describe('CTA Button', () => {
    it('should render "Get your free name report" CTA button', () => {
      render(<HeroSection />)
      const buttons = screen.getAllByRole('link', { name: 'Get your free name report' })
      expect(buttons.length).toBeGreaterThan(0)
      expect(buttons[0]).toHaveAttribute('href', '/sign-up')
    })

    it('should render subtitle "No credit card needed · Results in minutes"', () => {
      render(<HeroSection />)
      expect(screen.getByText(/No credit card needed/)).toBeInTheDocument()
    })
  })

  describe('Report Preview Card', () => {
    it('should render "Sample Report Preview" badge', () => {
      render(<HeroSection />)
      expect(screen.getByText('Sample Report Preview')).toBeInTheDocument()
    })
  })

  describe('Sample Name Preview Cards', () => {
    it('should render "Explore sample reports" text', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Explore sample reports/)).toBeInTheDocument()
    })

    it('should render Nia name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Purpose; brightness, radiance/)).toBeInTheDocument()
    })

    it('should render Rowan name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Little red one; rowan tree/)).toBeInTheDocument()
    })

    it('should render Kenji name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Intelligent second son; strong and vigorous/)).toBeInTheDocument()
    })

    it('should render Zara name card with meaning', () => {
      render(<HeroSection />)
      expect(screen.getByText(/Blooming flower; princess/)).toBeInTheDocument()
    })
  })
})
