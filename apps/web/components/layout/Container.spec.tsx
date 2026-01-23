import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Container } from './Container'

describe('Container', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(<Container>Container content</Container>)
      expect(screen.getByText('Container content')).toBeInTheDocument()
    })

    it('should render with default size (lg)', () => {
      render(<Container data-testid="container">Content</Container>)
      expect(screen.getByTestId('container')).toHaveClass('max-w-6xl')
    })

    it('should apply base responsive padding', () => {
      render(<Container data-testid="container">Content</Container>)
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })

    it('should apply mx-auto and w-full', () => {
      render(<Container data-testid="container">Content</Container>)
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('mx-auto', 'w-full')
    })
  })

  describe('Sizes', () => {
    it('should render sm size', () => {
      render(<Container size="sm" data-testid="container">Content</Container>)
      expect(screen.getByTestId('container')).toHaveClass('max-w-2xl')
    })

    it('should render md size', () => {
      render(<Container size="md" data-testid="container">Content</Container>)
      expect(screen.getByTestId('container')).toHaveClass('max-w-4xl')
    })

    it('should render lg size', () => {
      render(<Container size="lg" data-testid="container">Content</Container>)
      expect(screen.getByTestId('container')).toHaveClass('max-w-6xl')
    })

    it('should render xl size', () => {
      render(<Container size="xl" data-testid="container">Content</Container>)
      expect(screen.getByTestId('container')).toHaveClass('max-w-7xl')
    })

    it('should render full size without max-width constraint', () => {
      render(<Container size="full" data-testid="container">Content</Container>)
      const container = screen.getByTestId('container')
      expect(container).not.toHaveClass('max-w-2xl', 'max-w-4xl', 'max-w-6xl', 'max-w-7xl')
    })
  })

  describe('Custom className', () => {
    it('should merge custom className with default classes', () => {
      render(<Container className="custom-container py-8" data-testid="container">Content</Container>)
      const container = screen.getByTestId('container')
      expect(container).toHaveClass('custom-container', 'py-8')
      expect(container).toHaveClass('mx-auto', 'w-full')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML div attributes', () => {
      render(<Container id="main-container" role="main" data-testid="container">Content</Container>)
      const container = screen.getByTestId('container')
      expect(container).toHaveAttribute('id', 'main-container')
      expect(container).toHaveAttribute('role', 'main')
    })
  })
})
