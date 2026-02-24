import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  it('renders with section id and heading', () => {
    const { container } = render(<HowItWorks />)
    expect(container.querySelector('section#how-it-works')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /What/ })).toBeInTheDocument()
  })

  it('renders all four service items', () => {
    render(<HowItWorks />)
    expect(screen.getByText('The Intake Chat')).toBeInTheDocument()
    expect(screen.getByText('Intelligent Curation')).toBeInTheDocument()
    expect(screen.getByText('Vetted & Checked')).toBeInTheDocument()
    expect(screen.getByText('Your Dossier')).toBeInTheDocument()
  })
})
