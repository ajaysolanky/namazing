import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FreeformStep } from './FreeformStep'
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

describe('FreeformStep', () => {
  describe('Rendering', () => {
    it('should render step header', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Anything else?')).toBeInTheDocument()
    })

    it('should render textarea for notes', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByPlaceholderText(/share anything else/i)).toBeInTheDocument()
    })

    it('should render inspiration toggle', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText(/need inspiration/i)).toBeInTheDocument()
    })

    it('should render example section', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Example from another family')).toBeInTheDocument()
    })
  })

  describe('Notes Input', () => {
    it('should display existing notes', () => {
      const formData = createMockFormData({ additionalNotes: 'We love nature names' })
      render(<FreeformStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByDisplayValue('We love nature names')).toBeInTheDocument()
    })

    it('should update notes when typing', () => {
      const updateField = vi.fn()
      render(<FreeformStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.change(screen.getByPlaceholderText(/share anything else/i), {
        target: { value: 'We want a unique name' },
      })

      expect(updateField).toHaveBeenCalledWith('additionalNotes', 'We want a unique name')
    })
  })

  describe('Character Count', () => {
    it('should show optional message when empty', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Optional, but helpful')).toBeInTheDocument()
    })

    it('should show character count when has content', () => {
      const formData = createMockFormData({ additionalNotes: 'Hello' })
      render(<FreeformStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('5 characters')).toBeInTheDocument()
    })

    it('should show encouragement for detailed notes', () => {
      const formData = createMockFormData({
        additionalNotes: 'This is a fairly detailed note about our naming preferences and what we are looking for.',
      })
      render(<FreeformStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('Great detail!')).toBeInTheDocument()
    })
  })

  describe('Prompt Inspiration', () => {
    it('should toggle prompts visibility when clicking', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)

      // Initially prompts are hidden
      expect(screen.queryByText('Practical')).not.toBeInTheDocument()

      // Click to show
      fireEvent.click(screen.getByText(/need inspiration/i))

      // Now prompts should be visible
      expect(screen.getByText('Practical')).toBeInTheDocument()
      expect(screen.getByText('Personal')).toBeInTheDocument()
      expect(screen.getByText('Sound')).toBeInTheDocument()
    })

    it('should hide prompts when clicking again', () => {
      render(<FreeformStep formData={createMockFormData()} updateField={vi.fn()} />)

      // Show prompts
      fireEvent.click(screen.getByText(/need inspiration/i))
      expect(screen.getByText('Practical')).toBeInTheDocument()

      // Hide prompts
      fireEvent.click(screen.getByText('Hide inspiration'))
      expect(screen.queryByText('Practical')).not.toBeInTheDocument()
    })

    it('should add prompt to notes when clicking', () => {
      const updateField = vi.fn()
      render(<FreeformStep formData={createMockFormData()} updateField={updateField} />)

      // Show prompts
      fireEvent.click(screen.getByText(/need inspiration/i))

      // Click a prompt
      fireEvent.click(screen.getByText(/the name needs to work in both english/i))

      expect(updateField).toHaveBeenCalledWith(
        'additionalNotes',
        'The name needs to work in both English and [language]'
      )
    })

    it('should append prompt to existing notes', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({ additionalNotes: 'Existing notes' })
      render(<FreeformStep formData={formData} updateField={updateField} />)

      // Show prompts
      fireEvent.click(screen.getByText(/need inspiration/i))

      // Click a prompt
      fireEvent.click(screen.getByText(/the name needs to work in both english/i))

      expect(updateField).toHaveBeenCalledWith(
        'additionalNotes',
        'Existing notes\n\nThe name needs to work in both English and [language]'
      )
    })
  })
})
