import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from './Header'

describe('Header', () => {
  it('renders brand link', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Namazing' })).toHaveAttribute('href', '/')
  })

  it('renders main nav links', () => {
    render(<Header />)
    expect(screen.getByText('Services')).toBeInTheDocument()
    expect(screen.getByText('The Dossier')).toBeInTheDocument()
    expect(screen.getByText('Testimonials')).toBeInTheDocument()
  })

  it('renders start consultation cta', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: 'Start Consultation' })).toHaveAttribute('href', '/intake')
  })

  it('renders without a header border to match landing reference', () => {
    render(<Header />)
    expect(screen.getByRole('banner')).not.toHaveClass('border-b')
  })
})
