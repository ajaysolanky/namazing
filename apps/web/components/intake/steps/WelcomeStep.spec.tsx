import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  middleNameBoy: "",
  middleNameGirl: "",
  additionalNotes: '',
  ...overrides,
})

describe('WelcomeStep', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

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

  describe('Edge Cases', () => {
    it('should render without crashing when no gender selected', () => {
      const formData = createMockFormData({ babyGender: undefined })
      render(<WelcomeStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('A boy')).toBeInTheDocument()
      expect(screen.getByText('A girl')).toBeInTheDocument()
    })
  })
})
