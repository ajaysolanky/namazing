import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should render with default variant and size', () => {
      render(<Button>Default</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-studio-ink')
      expect(button).toHaveClass('h-11')
    })
  })

  describe('Variants', () => {
    it('should render primary variant', () => {
      render(<Button variant="primary">Primary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-studio-ink', 'text-white')
    })

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>)
      expect(screen.getByRole('button')).toHaveClass('bg-white', 'text-studio-ink')
    })

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>)
      expect(screen.getByRole('button')).toHaveClass('text-studio-ink')
    })

    it('should render rose variant', () => {
      render(<Button variant="rose">Rose</Button>)
      expect(screen.getByRole('button')).toHaveClass('from-studio-rose')
    })

    it('should render premium variant', () => {
      render(<Button variant="premium">Premium</Button>)
      expect(screen.getByRole('button')).toHaveClass('shadow-card')
    })
  })

  describe('Sizes', () => {
    it('should render sm size', () => {
      render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-9', 'px-4')
    })

    it('should render md size', () => {
      render(<Button size="md">Medium</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-11', 'px-6')
    })

    it('should render lg size', () => {
      render(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-14', 'px-8')
    })

    it('should render xl size', () => {
      render(<Button size="xl">Extra Large</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-16', 'px-10')
    })

    it('should render icon size', () => {
      render(<Button size="icon">X</Button>)
      expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
    })
  })

  describe('Shimmer Effect', () => {
    it('should render shimmer element when shimmer prop is true', () => {
      render(<Button shimmer>Shimmer</Button>)
      const button = screen.getByRole('button')
      expect(button.querySelector('.animate-shimmer')).toBeInTheDocument()
    })

    it('should not render shimmer element when shimmer prop is false', () => {
      render(<Button>No Shimmer</Button>)
      const button = screen.getByRole('button')
      expect(button.querySelector('.animate-shimmer')).not.toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toBeDisabled()
    })

    it('should apply disabled styles', () => {
      render(<Button disabled>Disabled</Button>)
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50')
    })
  })

  describe('Event Handlers', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click</Button>)

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Custom className', () => {
    it('should merge custom className with default classes', () => {
      render(<Button className="custom-class">Custom</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
      expect(button).toHaveClass('inline-flex')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through HTML button attributes', () => {
      render(<Button type="submit" name="submit-btn">Submit</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('name', 'submit-btn')
    })
  })
})
