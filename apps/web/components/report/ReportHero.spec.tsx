import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReportHero } from './ReportHero'

describe('ReportHero', () => {
  describe('Rendering', () => {
    it('should render the surname', () => {
      render(<ReportHero surname="Johnson" summary="Your perfect names" />)
      expect(screen.getByText('Johnson')).toBeInTheDocument()
    })

    it('should render the summary', () => {
      render(<ReportHero surname="Johnson" summary="We found beautiful names for your family" />)
      expect(screen.getByText('We found beautiful names for your family')).toBeInTheDocument()
    })

    it('should render the family label', () => {
      render(<ReportHero surname="Johnson" summary="Summary" />)
      expect(screen.getByText('Family')).toBeInTheDocument()
    })

    it('should render "The" prefix', () => {
      render(<ReportHero surname="Johnson" summary="Summary" />)
      expect(screen.getByText('The')).toBeInTheDocument()
    })

    it('should render the consultation badge', () => {
      render(<ReportHero surname="Johnson" summary="Summary" />)
      expect(screen.getByText('Your personalized name consultation')).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('should render with heading level 1', () => {
      render(<ReportHero surname="Smith" summary="Summary" />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Smith')
    })
  })
})
