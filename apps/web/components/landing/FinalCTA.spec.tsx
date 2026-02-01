import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { FinalCTA } from './FinalCTA'

describe('FinalCTA', () => {
  describe('Heading', () => {
    it('should render heading with "Ready to find"', () => {
      render(<FinalCTA />)
      expect(screen.getByText(/Ready to find/)).toBeInTheDocument()
    })

    it('should render heading with "the one"', () => {
      render(<FinalCTA />)
      expect(screen.getByText('the one')).toBeInTheDocument()
    })
  })

  describe('Description', () => {
    it('should render description text', () => {
      render(<FinalCTA />)
      expect(screen.getByText(/Your perfect baby name is waiting/)).toBeInTheDocument()
    })
  })

  describe('CTA Button', () => {
    it('should render "Begin your journey" button', () => {
      render(<FinalCTA />)
      const button = screen.getByRole('link', { name: 'Begin your journey' })
      expect(button).toBeInTheDocument()
    })

    it('should link to /sign-up', () => {
      render(<FinalCTA />)
      const button = screen.getByRole('link', { name: 'Begin your journey' })
      expect(button).toHaveAttribute('href', '/sign-up')
    })
  })
})
