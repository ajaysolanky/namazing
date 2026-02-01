import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Testimonials } from './Testimonials'

describe('Testimonials', () => {
  describe('Section Structure', () => {
    it('should render heading "Loved by families"', () => {
      render(<Testimonials />)
      expect(screen.getByText('Loved by families')).toBeInTheDocument()
    })

    it('should render section description', () => {
      render(<Testimonials />)
      expect(screen.getByText(/Hear from parents who found the perfect name/)).toBeInTheDocument()
    })
  })

  describe('Testimonial Cards', () => {
    it('should render 3 testimonial cards', () => {
      const { container } = render(<Testimonials />)
      const testimonialCards = container.querySelectorAll('.bg-white\\/80')
      expect(testimonialCards.length).toBe(3)
    })

    it('should render first testimonial from "Sarah & James"', () => {
      render(<Testimonials />)
      expect(screen.getByText('Sarah & James')).toBeInTheDocument()
      expect(screen.getByText(/We were completely stuck on names/)).toBeInTheDocument()
    })

    it('should render avatar initials "SJ"', () => {
      render(<Testimonials />)
      expect(screen.getByText('SJ')).toBeInTheDocument()
    })

    it('should render second testimonial from "Priya M."', () => {
      render(<Testimonials />)
      expect(screen.getByText('Priya M.')).toBeInTheDocument()
      expect(screen.getByText(/The research depth blew me away/)).toBeInTheDocument()
    })

    it('should render avatar initials "PM"', () => {
      render(<Testimonials />)
      expect(screen.getByText('PM')).toBeInTheDocument()
    })

    it('should render third testimonial from "Ciara & Liam"', () => {
      render(<Testimonials />)
      expect(screen.getByText('Ciara & Liam')).toBeInTheDocument()
      expect(screen.getByText(/We wanted something that honored our Irish heritage/)).toBeInTheDocument()
    })

    it('should render avatar initials "CL"', () => {
      render(<Testimonials />)
      expect(screen.getByText('CL')).toBeInTheDocument()
    })

    it('should render all three testimonial author names', () => {
      render(<Testimonials />)
      expect(screen.getByText('Sarah & James')).toBeInTheDocument()
      expect(screen.getByText('Priya M.')).toBeInTheDocument()
      expect(screen.getByText('Ciara & Liam')).toBeInTheDocument()
    })

    it('should render all three avatar initials', () => {
      render(<Testimonials />)
      expect(screen.getByText('SJ')).toBeInTheDocument()
      expect(screen.getByText('PM')).toBeInTheDocument()
      expect(screen.getByText('CL')).toBeInTheDocument()
    })
  })
})
