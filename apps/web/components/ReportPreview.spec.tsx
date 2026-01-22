import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReportPreview } from './ReportPreview'

const mockResult = {
  report: {
    summary: 'A great selection of names.',
    finalists: [
      { name: 'Leo', why: 'Strong and classic' }
    ],
    tradeoffs: [
      'Leo is very popular right now'
    ],
    tie_break_tips: [
      'Say the name out loud with last name'
    ]
  }
}

describe('ReportPreview', () => {
  it('renders nothing when no result provided', () => {
    const { container } = render(<ReportPreview result={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders summary', () => {
    render(<ReportPreview result={mockResult as any} />)
    expect(screen.getByText('Client Report Preview')).toBeInTheDocument()
    expect(screen.getByText('A great selection of names.')).toBeInTheDocument()
  })

  it('renders finalists', () => {
    render(<ReportPreview result={mockResult as any} />)
    expect(screen.getByText('Leo')).toBeInTheDocument()
    expect(screen.getByText(/Strong and classic/)).toBeInTheDocument()
  })

  it('renders tradeoffs', () => {
    render(<ReportPreview result={mockResult as any} />)
    expect(screen.getByText('Tradeoffs & Pitfalls')).toBeInTheDocument()
    expect(screen.getByText(/Leo is very popular/)).toBeInTheDocument()
  })

  it('renders tie-break tips', () => {
    render(<ReportPreview result={mockResult as any} />)
    expect(screen.getByText('Tie-break Tips')).toBeInTheDocument()
    expect(screen.getByText(/Say the name out loud/)).toBeInTheDocument()
  })
})
