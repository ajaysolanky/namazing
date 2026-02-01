import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FAQ } from './FAQ'

// Mock Radix Accordion
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
  describe('Section Structure', () => {
    it('should have id="faq" on section', () => {
      const { container } = render(<FAQ />)
      const section = container.querySelector('section#faq')
      expect(section).toBeInTheDocument()
    })

    it('should render heading "Frequently asked questions"', () => {
      render(<FAQ />)
      expect(screen.getByText('Frequently asked questions')).toBeInTheDocument()
    })

    it('should render section description', () => {
      render(<FAQ />)
      expect(screen.getByText(/Everything you need to know about Namazing/)).toBeInTheDocument()
    })
  })

  describe('FAQ Questions', () => {
    it('should render "How does the AI naming process work?" question', () => {
      render(<FAQ />)
      expect(screen.getByText('How does the AI naming process work?')).toBeInTheDocument()
    })

    it('should render "Is it really free?" question', () => {
      render(<FAQ />)
      expect(screen.getByText('Is it really free?')).toBeInTheDocument()
    })

    it('should render "What kind of names can it suggest?" question', () => {
      render(<FAQ />)
      expect(screen.getByText('What kind of names can it suggest?')).toBeInTheDocument()
    })

    it('should render "How long does a consultation take?" question', () => {
      render(<FAQ />)
      expect(screen.getByText('How long does a consultation take?')).toBeInTheDocument()
    })

    it('should render "Can I run multiple consultations?" question', () => {
      render(<FAQ />)
      expect(screen.getByText('Can I run multiple consultations?')).toBeInTheDocument()
    })

    it('should render "Is my data private?" question', () => {
      render(<FAQ />)
      expect(screen.getByText('Is my data private?')).toBeInTheDocument()
    })

    it('should render all 6 FAQ questions', () => {
      render(<FAQ />)
      const questions = [
        'How does the AI naming process work?',
        'Is it really free?',
        'What kind of names can it suggest?',
        'How long does a consultation take?',
        'Can I run multiple consultations?',
        'Is my data private?',
      ]
      questions.forEach((question) => {
        expect(screen.getByText(question)).toBeInTheDocument()
      })
    })
  })

  describe('FAQ Answers', () => {
    it('should render answer about the five-stage pipeline', () => {
      render(<FAQ />)
      expect(screen.getByText(/You share your family story, preferences, and any constraints/)).toBeInTheDocument()
    })

    it('should render answer about free tier', () => {
      render(<FAQ />)
      expect(screen.getByText(/Yes! The free tier gives you full access/)).toBeInTheDocument()
    })

    it('should render answer about name styles', () => {
      render(<FAQ />)
      expect(screen.getByText(/Any style you like: classic, modern, literary/)).toBeInTheDocument()
    })

    it('should render answer about consultation duration', () => {
      render(<FAQ />)
      expect(screen.getByText(/A typical run completes in a few minutes/)).toBeInTheDocument()
    })

    it('should render answer about multiple consultations', () => {
      render(<FAQ />)
      expect(screen.getByText(/Absolutely. Each run is saved to your dashboard/)).toBeInTheDocument()
    })

    it('should render answer about data privacy', () => {
      render(<FAQ />)
      expect(screen.getByText(/Your briefs and results are stored securely/)).toBeInTheDocument()
    })
  })
})
