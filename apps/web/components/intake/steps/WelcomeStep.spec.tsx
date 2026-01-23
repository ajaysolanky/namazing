import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WelcomeStep } from './WelcomeStep'
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
  additionalNotes: '',
  ...overrides,
})

describe('WelcomeStep', () => {
  describe('Rendering', () => {
    it('should render the welcome header', () => {
      render(<WelcomeStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText(/choosing a name is one of the/i)).toBeInTheDocument()
    })

    it('should render journey indicator', () => {
      render(<WelcomeStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Your naming journey begins')).toBeInTheDocument()
    })

    it('should render gender selection question', () => {
      render(<WelcomeStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('First, who are we naming?')).toBeInTheDocument()
    })

    it('should render all three gender options', () => {
      render(<WelcomeStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('A boy')).toBeInTheDocument()
      expect(screen.getByText('A girl')).toBeInTheDocument()
      expect(screen.getByText(/surprise/i)).toBeInTheDocument()
    })

    it('should render reassurance message', () => {
      render(<WelcomeStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText(/you can explore names for any gender/i)).toBeInTheDocument()
    })
  })

  describe('Gender Selection', () => {
    it('should call updateField when selecting boy', () => {
      const updateField = vi.fn()
      render(<WelcomeStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByText('A boy'))

      expect(updateField).toHaveBeenCalledWith('babyGender', 'boy')
    })

    it('should call updateField when selecting girl', () => {
      const updateField = vi.fn()
      render(<WelcomeStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByText('A girl'))

      expect(updateField).toHaveBeenCalledWith('babyGender', 'girl')
    })

    it('should call updateField when selecting surprise', () => {
      const updateField = vi.fn()
      render(<WelcomeStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByText(/surprise/i))

      expect(updateField).toHaveBeenCalledWith('babyGender', 'unknown')
    })
  })

  describe('Selection State', () => {
    it('should show boy as selected when babyGender is boy', () => {
      const formData = createMockFormData({ babyGender: 'boy' })
      const { container } = render(<WelcomeStep formData={formData} updateField={vi.fn()} />)

      // The selected option should have a checkmark indicator
      const checkmarks = container.querySelectorAll('path[d="M5 13l4 4L19 7"]')
      expect(checkmarks.length).toBeGreaterThan(0)
    })

    it('should show girl as selected when babyGender is girl', () => {
      const formData = createMockFormData({ babyGender: 'girl' })
      const { container } = render(<WelcomeStep formData={formData} updateField={vi.fn()} />)

      const checkmarks = container.querySelectorAll('path[d="M5 13l4 4L19 7"]')
      expect(checkmarks.length).toBeGreaterThan(0)
    })

    it('should show unknown as selected when babyGender is unknown', () => {
      const formData = createMockFormData({ babyGender: 'unknown' })
      const { container } = render(<WelcomeStep formData={formData} updateField={vi.fn()} />)

      const checkmarks = container.querySelectorAll('path[d="M5 13l4 4L19 7"]')
      expect(checkmarks.length).toBeGreaterThan(0)
    })
  })
})
