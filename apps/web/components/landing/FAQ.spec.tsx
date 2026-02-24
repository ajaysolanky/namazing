import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FAQ } from './FAQ'

vi.mock('@radix-ui/react-accordion', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Item: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-value={value}>{children}</div>
  ),
  Header: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Trigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
  Content: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('FAQ', () => {
  it('renders faq section heading', () => {
    const { container } = render(<FAQ />)
    expect(container.querySelector('section#faq')).toBeInTheDocument()
    expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
    expect(screen.getByText(/Everything you need to know before you begin/)).toBeInTheDocument()
  })

  it('renders all configured faq questions', () => {
    render(<FAQ />)
    expect(screen.getByText('How does the AI naming process work?')).toBeInTheDocument()
    expect(screen.getByText('Is my data private?')).toBeInTheDocument()
  })
})
