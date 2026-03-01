import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders with section id and heading', () => {
    const { container } = render(<HowItWorks />)
    expect(container.querySelector('section#how-it-works')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /What/ })).toBeInTheDocument()
  })

  it('renders all three process steps', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Tell us your taste')).toBeInTheDocument()
    expect(screen.getByText('We research the shortlist')).toBeInTheDocument()
    expect(screen.getByText('Get a naming report')).toBeInTheDocument()
  })
})
