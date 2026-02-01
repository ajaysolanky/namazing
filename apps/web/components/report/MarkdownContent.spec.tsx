import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MarkdownContent } from './MarkdownContent'

// Do NOT mock react-markdown — we want the inline component overrides
// to actually be called so they count towards function coverage.

describe('MarkdownContent', () => {
  it('should render plain paragraph text via p override', () => {
    render(<MarkdownContent content="Hello world" />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('should render bold text via strong override', () => {
    render(<MarkdownContent content="Hello **bold** text" />)
    expect(screen.getByText('bold')).toBeInTheDocument()
  })

  it('should render italic text via em override', () => {
    render(<MarkdownContent content="Hello *italic* text" />)
    expect(screen.getByText('italic')).toBeInTheDocument()
  })

  it('should render h1 via the h1 override', () => {
    render(<MarkdownContent content="# Main Title" />)
    // The h1 override adds font-display class
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('font-display')
  })

  it('should render h2 via the h2 override', () => {
    render(<MarkdownContent content="## Section Title" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('font-display')
  })

  it('should render h3 via the h3 override', () => {
    render(<MarkdownContent content="### Sub Section" />)
    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveClass('font-display')
  })

  it('should render unordered list items via ul/li overrides', () => {
    const md = `Text before

- Apple
- Banana`
    render(<MarkdownContent content={md} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })

  it('should render ordered list items via ol/li overrides', () => {
    const md = `Text before

1. First
2. Second`
    render(<MarkdownContent content={md} />)
    expect(screen.getByText('First')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
  })

  it('should render blockquotes via blockquote override', () => {
    render(<MarkdownContent content="> A quoted line" />)
    expect(screen.getByText('A quoted line')).toBeInTheDocument()
  })

  it('should render hr via hr override', () => {
    const md = `Above

---

Below`
    const { container } = render(<MarkdownContent content={md} />)
    expect(screen.getByText('Above')).toBeInTheDocument()
    expect(screen.getByText('Below')).toBeInTheDocument()
    // hr override renders decorative gradient divs instead of <hr>
    expect(container.querySelectorAll('.bg-gradient-to-r').length).toBeGreaterThan(0)
  })

  it('should render links via a override with target blank', () => {
    render(<MarkdownContent content="[Click me](https://example.com)" />)
    const link = screen.getByRole('link', { name: 'Click me' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should render inline code via code override', () => {
    render(<MarkdownContent content="Use `npm install` to begin" />)
    const code = screen.getByText('npm install')
    expect(code).toBeInTheDocument()
    expect(code.tagName).toBe('CODE')
  })

  it('should render tables via table overrides', () => {
    const table = '| Name | Score |\n|------|-------|\n| Alice | 95 |\n| Bob | 87 |'
    render(<MarkdownContent content={table} />)
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('should render the personalized consultation header', () => {
    render(<MarkdownContent content="Test" />)
    expect(
      screen.getByText('Your Personalized Consultation')
    ).toBeInTheDocument()
  })

  it('should render the signature flourish', () => {
    render(<MarkdownContent content="Test" />)
    expect(
      screen.getByText('Crafted with care by Namazing')
    ).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <MarkdownContent content="Test" className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
