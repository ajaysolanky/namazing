import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  describe('Rendering', () => {
    it('should render the header element', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should render the namazing logo/brand', () => {
      render(<Header />)
      expect(screen.getByText('namazing')).toBeInTheDocument()
    })

    it('should render navigation', () => {
      render(<Header />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should render home link on logo', () => {
      render(<Header />)
      const homeLink = screen.getByRole('link', { name: 'namazing' })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should render consultation link', () => {
      render(<Header />)
      const consultationLink = screen.getByRole('link', { name: 'Start consultation' })
      expect(consultationLink).toHaveAttribute('href', '/intake')
    })
  })

  describe('Styling', () => {
    it('should be sticky positioned', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toHaveClass('sticky', 'top-0')
    })

    it('should have backdrop blur', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toHaveClass('backdrop-blur-md')
    })
  })
})
