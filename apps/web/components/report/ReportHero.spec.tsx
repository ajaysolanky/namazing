import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReportHero } from './ReportHero'

describe('ReportHero', () => {
  describe('Rendering', () => {
    it('should render the surname in heading', async () => {
      render(<ReportHero surname="Johnson" summary="Your perfect names" />)
      // Wait for content to show (delayed by 300ms)
      await new Promise(r => setTimeout(r, 400))
      expect(screen.getByText(/The Johnson/)).toBeInTheDocument()
    })

    it('should render the summary as quote', async () => {
      render(<ReportHero surname="Johnson" summary="We found beautiful names for your family" />)
      await new Promise(r => setTimeout(r, 400))
      expect(screen.getByText(/We found beautiful names for your family/)).toBeInTheDocument()
    })

    it('should render the family label', async () => {
      render(<ReportHero surname="Johnson" summary="Summary" />)
      await new Promise(r => setTimeout(r, 400))
      expect(screen.getByText('Family')).toBeInTheDocument()
    })

    it('should render introducing text', async () => {
      render(<ReportHero surname="Johnson" summary="Summary" />)
      await new Promise(r => setTimeout(r, 400))
      expect(screen.getByText('Introducing names for')).toBeInTheDocument()
    })

    it('should render the consultation badge', async () => {
      render(<ReportHero surname="Johnson" summary="Summary" />)
      await new Promise(r => setTimeout(r, 400))
      expect(screen.getByText(/personalized name consultation is ready/)).toBeInTheDocument()
    })
  })

  describe('Layout', () => {
    it('should render with heading level 1', async () => {
      render(<ReportHero surname="Smith" summary="Summary" />)
      await new Promise(r => setTimeout(r, 400))
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
      expect(heading).toHaveTextContent('Smith')
    })
  })
})
