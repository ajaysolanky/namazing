import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ReportHero } from './ReportHero'

vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}))
vi.mock('remark-gfm', () => ({ default: {} }))

describe('ReportHero', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not show content before the 300ms delay', () => {
    render(<ReportHero surname="Johnson" summary="A wonderful set of names" />)

    // Before the timer fires, the gated content should not appear
    expect(screen.queryByText('Introducing names for')).not.toBeInTheDocument()
    expect(screen.queryByText(/The Johnson/)).not.toBeInTheDocument()
    expect(screen.queryByText('Family')).not.toBeInTheDocument()
  })

  it('renders "Introducing names for" after the 300ms delay', () => {
    render(<ReportHero surname="Johnson" summary="Summary text" />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('Introducing names for')).toBeInTheDocument()
  })

  it('renders "The {surname}" after the delay', () => {
    render(<ReportHero surname="Martinez" summary="Summary text" />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText(/The Martinez/)).toBeInTheDocument()
  })

  it('renders "Family" after the delay', () => {
    render(<ReportHero surname="Smith" summary="Summary text" />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('Family')).toBeInTheDocument()
  })

  it('renders the summary via ReactMarkdown', () => {
    const summary = 'We found **beautiful** names for your family'
    render(<ReportHero surname="Doe" summary={summary} />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    const markdown = screen.getByTestId('markdown')
    expect(markdown).toBeInTheDocument()
    expect(markdown).toHaveTextContent(summary)
  })

  it('renders the "Discover your names" scroll indicator', () => {
    render(<ReportHero surname="Lee" summary="Summary" />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText('Discover your names')).toBeInTheDocument()
  })

  it('renders with heading level 1 containing the surname', () => {
    render(<ReportHero surname="Garcia" summary="Summary" />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Garcia')
    expect(heading).toHaveTextContent('Family')
  })

  it('renders the consultation-ready badge', () => {
    render(<ReportHero surname="Patel" summary="Summary" />)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.getByText(/personalized name consultation is ready/)).toBeInTheDocument()
  })
})
