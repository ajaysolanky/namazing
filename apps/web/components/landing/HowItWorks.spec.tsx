import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { HowItWorks } from './HowItWorks'

describe('HowItWorks', () => {
  describe('Section Structure', () => {
    it('should have id="how-it-works" on section', () => {
      const { container } = render(<HowItWorks />)
      const section = container.querySelector('section#how-it-works')
      expect(section).toBeInTheDocument()
    })

    it('should render section heading "A thoughtful naming journey"', () => {
      render(<HowItWorks />)
      expect(screen.getByText('A thoughtful naming journey')).toBeInTheDocument()
    })

    it('should render "How it works" label', () => {
      render(<HowItWorks />)
      expect(screen.getByText('How it works')).toBeInTheDocument()
    })

    it('should render section description', () => {
      render(<HowItWorks />)
      expect(screen.getByText(/We don't just suggest names/)).toBeInTheDocument()
    })
  })

  describe('Steps', () => {
    it('should render step number 1', () => {
      render(<HowItWorks />)
      expect(screen.getByText('1')).toBeInTheDocument()
    })

    it('should render step 1: "Tell your story"', () => {
      render(<HowItWorks />)
      expect(screen.getByText('Tell your story')).toBeInTheDocument()
    })

    it('should render step 1 description', () => {
      render(<HowItWorks />)
      expect(screen.getByText(/Share your family background, style preferences, heritage/)).toBeInTheDocument()
    })

    it('should render step number 2', () => {
      render(<HowItWorks />)
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should render step 2: "AI researches"', () => {
      render(<HowItWorks />)
      expect(screen.getByText('AI researches')).toBeInTheDocument()
    })

    it('should render step 2 description', () => {
      render(<HowItWorks />)
      expect(screen.getByText(/Our pipeline generates candidates, researches meanings/)).toBeInTheDocument()
    })

    it('should render step number 3', () => {
      render(<HowItWorks />)
      expect(screen.getByText('3')).toBeInTheDocument()
    })

    it('should render step 3: "Get your shortlist"', () => {
      render(<HowItWorks />)
      expect(screen.getByText('Get your shortlist')).toBeInTheDocument()
    })

    it('should render step 3 description', () => {
      render(<HowItWorks />)
      expect(screen.getByText(/Receive a curated shortlist of 8-12 finalists/)).toBeInTheDocument()
    })

    it('should render exactly 3 steps', () => {
      render(<HowItWorks />)
      const stepNumbers = ['1', '2', '3']
      stepNumbers.forEach((num) => {
        expect(screen.getByText(num)).toBeInTheDocument()
      })
    })
  })
})
