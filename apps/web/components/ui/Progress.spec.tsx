import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress } from './Progress'

describe('Progress', () => {
  describe('Rendering', () => {
    it('should render a progressbar element', () => {
      render(<Progress value={50} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should apply default styles', () => {
      render(<Progress value={50} data-testid="progress" />)
      expect(screen.getByTestId('progress')).toHaveClass('h-2', 'rounded-full')
    })
  })

  describe('Value', () => {
    it('should render with 0 value', () => {
      render(<Progress value={0} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should render with 100 value', () => {
      render(<Progress value={100} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should render with undefined value', () => {
      render(<Progress />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should render with decimal value', () => {
      render(<Progress value={33.33} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('should merge custom className on root', () => {
      render(<Progress value={50} className="custom-progress" data-testid="progress" />)
      expect(screen.getByTestId('progress')).toHaveClass('custom-progress')
    })

    it('should apply indicatorClassName to indicator', () => {
      const { container } = render(<Progress value={50} indicatorClassName="custom-indicator" />)
      const indicator = container.querySelector('.custom-indicator')
      expect(indicator).toBeInTheDocument()
    })
  })
})
