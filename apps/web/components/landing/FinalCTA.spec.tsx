import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FinalCTA } from './FinalCTA'

describe('FinalCTA', () => {
  describe('Heading', () => {
    it('should render heading with "perfect name"', () => {
      render(<FinalCTA />)
      expect(screen.getByText(/perfect name/)).toBeInTheDocument()
    })

    it('should render heading with "minutes away"', () => {
      render(<FinalCTA />)
      expect(screen.getByText(/minutes away/)).toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('should render description text', () => {
      render(<FinalCTA />)
      expect(screen.getByText(/Tell us your story/)).toBeInTheDocument()
    })
  })

  describe('CTA Button', () => {
    it('should render "Get your personalized shortlist" button', () => {
      render(<FinalCTA />)
      const button = screen.getByRole('link', { name: 'Get your personalized shortlist' })
      expect(button).toBeInTheDocument()
    })

    it('should link to /sign-up', () => {
      render(<FinalCTA />)
      const button = screen.getByRole('link', { name: 'Get your personalized shortlist' })
      expect(button).toHaveAttribute('href', '/sign-up')
    })
  })
})
