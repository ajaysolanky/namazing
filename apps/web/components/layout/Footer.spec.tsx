import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Footer } from './Footer'

describe('Footer', () => {
  it('renders footer with brand', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('Namazing')).toBeInTheDocument()
  })

  it('renders legal and contact links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy')
    expect(screen.getByRole('link', { name: 'Terms' })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/sign-in')
  })

  it('renders current year copyright', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(String(year))).toBeInTheDocument()
    expect(screen.getByText(/Namazing\. All rights reserved\./)).toBeInTheDocument()
  })
})
