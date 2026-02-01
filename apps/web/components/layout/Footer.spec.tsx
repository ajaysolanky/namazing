import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  describe('Rendering', () => {
    it('should render the footer element', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('should render the namazing brand', () => {
      render(<Footer />)
      expect(screen.getByText('namazing')).toBeInTheDocument()
    })

    it('should render product links', () => {
      render(<Footer />)
      expect(screen.getByText('How it Works')).toBeInTheDocument()
      expect(screen.getByText('Pricing')).toBeInTheDocument()
      expect(screen.getByText('FAQ')).toBeInTheDocument()
    })

    it('should render legal links', () => {
      render(<Footer />)
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
      expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    })

    it('should render copyright', () => {
      render(<Footer />)
      const year = new Date().getFullYear()
      expect(screen.getByText(new RegExp(`${year} Namazing`))).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have top border', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toHaveClass('border-t')
    })

    it('should have margin-top auto for sticky footer', () => {
      render(<Footer />)
      expect(screen.getByRole('contentinfo')).toHaveClass('mt-auto')
    })
  })
})
