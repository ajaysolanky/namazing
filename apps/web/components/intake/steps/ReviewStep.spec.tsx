import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ReviewStep } from './ReviewStep'
import type { IntakeFormData } from '@/hooks/useIntakeForm'

const createMockFormData = (overrides: Partial<IntakeFormData> = {}): IntakeFormData => ({
  babyGender: undefined,
  surname: '',
  siblings: [],
  stylePreferences: [],
  lengthPreference: 'any',
  nicknameTolerance: 'medium',
  namesConsidering: [],
  namesToAvoid: [],
  culturalConsiderations: [],
  familyTraditions: '',
  honorNames: [],
  middleNameBoy: "",
  middleNameGirl: "",
  additionalNotes: '',
  ...overrides,
})

describe('ReviewStep', () => {
  describe('Rendering', () => {
    it('should render ready indicator', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.getByText('Ready to begin')).toBeInTheDocument()
    })

    it('should render step header', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.getByText(/here's what we learned/i)).toBeInTheDocument()
    })

    it('should render what happens next section', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.getByText('What happens next')).toBeInTheDocument()
    })

    it('should render time estimate', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.getByText(/usually takes 2-3 minutes/i)).toBeInTheDocument()
    })
  })

  describe('Family Summary', () => {
    it('should display surname', () => {
      const formData = createMockFormData({ surname: 'Johnson' })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText('The Johnson family')).toBeInTheDocument()
    })

    it('should show placeholder when no surname', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.getByText('The [Surname] family')).toBeInTheDocument()
    })

    it('should display gender preference for boy', () => {
      const formData = createMockFormData({ babyGender: 'boy', surname: 'Test' })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/looking for boy names/i)).toBeInTheDocument()
    })

    it('should display gender preference for girl', () => {
      const formData = createMockFormData({ babyGender: 'girl', surname: 'Test' })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/looking for girl names/i)).toBeInTheDocument()
    })

    it('should display gender preference for unknown', () => {
      const formData = createMockFormData({ babyGender: 'unknown', surname: 'Test' })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/looking for names for any gender/i)).toBeInTheDocument()
    })

    it('should display siblings', () => {
      const formData = createMockFormData({
        surname: 'Test',
        siblings: [{ name: 'Emma', age: '5' }, { name: 'Jack', age: '3' }],
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/a sibling for Emma and Jack/i)).toBeInTheDocument()
    })
  })

  describe('Style Summary', () => {
    it('should display style preferences', () => {
      const formData = createMockFormData({
        stylePreferences: ['classic', 'modern'],
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText('Style preferences')).toBeInTheDocument()
      expect(screen.getByText(/classic, modern/i)).toBeInTheDocument()
    })

    it('should display length preference', () => {
      const formData = createMockFormData({
        stylePreferences: ['classic'],
        lengthPreference: 'short',
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/short names/i)).toBeInTheDocument()
    })

    it('should not display style section when empty', () => {
      const formData = createMockFormData({ stylePreferences: [] })
      render(<ReviewStep formData={formData} />)

      expect(screen.queryByText('Style preferences')).not.toBeInTheDocument()
    })
  })

  describe('Heritage Summary', () => {
    it('should display cultural considerations', () => {
      const formData = createMockFormData({
        culturalConsiderations: ['Irish', 'Italian'],
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText('Heritage & honors')).toBeInTheDocument()
      expect(screen.getByText(/Irish, Italian/i)).toBeInTheDocument()
    })

    it('should display honor names', () => {
      const formData = createMockFormData({
        honorNames: ['Grandma Rose', 'Uncle Jim'],
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/honoring Grandma Rose, Uncle Jim/i)).toBeInTheDocument()
    })

    it('should not display heritage section when empty', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.queryByText('Heritage & honors')).not.toBeInTheDocument()
    })
  })

  describe('Names Summary', () => {
    it('should display names being considered', () => {
      const formData = createMockFormData({
        namesConsidering: [{ name: 'Luna' }, { name: 'Aria' }],
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText('Names on your radar')).toBeInTheDocument()
      expect(screen.getByText(/considering Luna, Aria/i)).toBeInTheDocument()
    })

    it('should display names to avoid', () => {
      const formData = createMockFormData({
        namesToAvoid: ['Keith', 'Karen'],
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText(/avoiding Keith, Karen/i)).toBeInTheDocument()
    })

    it('should not display names section when empty', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.queryByText('Names on your radar')).not.toBeInTheDocument()
    })
  })

  describe('Notes Summary', () => {
    it('should display additional notes', () => {
      const formData = createMockFormData({
        additionalNotes: 'We want something unique but not too unusual',
      })
      render(<ReviewStep formData={formData} />)

      expect(screen.getByText('Your notes')).toBeInTheDocument()
      expect(screen.getByText(/we want something unique/i)).toBeInTheDocument()
    })

    it('should not display notes section when empty', () => {
      render(<ReviewStep formData={createMockFormData()} />)
      expect(screen.queryByText('Your notes')).not.toBeInTheDocument()
    })
  })

  describe('What Happens Next', () => {
    it('should display all three steps', () => {
      render(<ReviewStep formData={createMockFormData()} />)

      expect(screen.getByText(/dozens of names/i)).toBeInTheDocument()
      expect(screen.getByText(/deep research/i)).toBeInTheDocument()
      expect(screen.getByText(/personalized shortlist/i)).toBeInTheDocument()
    })
  })
})
