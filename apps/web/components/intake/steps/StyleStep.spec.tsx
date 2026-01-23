import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { StyleStep } from './StyleStep'
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

describe('StyleStep', () => {
  describe('Rendering', () => {
    it('should render step header', () => {
      render(<StyleStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('What speaks to you?')).toBeInTheDocument()
    })

    it('should render all style options', () => {
      render(<StyleStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Timeless')).toBeInTheDocument()
      expect(screen.getByText('Contemporary')).toBeInTheDocument()
      expect(screen.getByText('Distinctive')).toBeInTheDocument()
      expect(screen.getByText('Nature-inspired')).toBeInTheDocument()
      expect(screen.getByText('Storied')).toBeInTheDocument()
      expect(screen.getByText('Heritage')).toBeInTheDocument()
    })

    it('should render length preference options', () => {
      render(<StyleStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Short & sweet')).toBeInTheDocument()
      expect(screen.getByText('Balanced')).toBeInTheDocument()
      expect(screen.getByText('Open to all')).toBeInTheDocument()
    })

    it('should render nickname preference options', () => {
      render(<StyleStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Full name, please')).toBeInTheDocument()
      expect(screen.getByText('Nicknames welcome')).toBeInTheDocument()
      expect(screen.getByText('Love nicknames')).toBeInTheDocument()
    })
  })

  describe('Style Selection', () => {
    it('should toggle style when clicking', () => {
      const updateField = vi.fn()
      render(<StyleStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByText('Timeless'))

      expect(updateField).toHaveBeenCalledWith('stylePreferences', ['classic'])
    })

    it('should add style to existing selections', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({ stylePreferences: ['classic'] })
      render(<StyleStep formData={formData} updateField={updateField} />)

      fireEvent.click(screen.getByText('Contemporary'))

      expect(updateField).toHaveBeenCalledWith('stylePreferences', ['classic', 'modern'])
    })

    it('should remove style when clicking selected style', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({ stylePreferences: ['classic', 'modern'] })
      render(<StyleStep formData={formData} updateField={updateField} />)

      fireEvent.click(screen.getByText('Timeless'))

      expect(updateField).toHaveBeenCalledWith('stylePreferences', ['modern'])
    })

    it('should show hint when no styles selected', () => {
      render(<StyleStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText(/select at least one style/i)).toBeInTheDocument()
    })

    it('should hide hint when styles are selected', () => {
      const formData = createMockFormData({ stylePreferences: ['classic'] })
      render(<StyleStep formData={formData} updateField={vi.fn()} />)
      expect(screen.queryByText(/select at least one style/i)).not.toBeInTheDocument()
    })
  })

  describe('Length Preference', () => {
    it('should call updateField when selecting length preference', () => {
      const updateField = vi.fn()
      render(<StyleStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByText('Short & sweet'))

      expect(updateField).toHaveBeenCalledWith('lengthPreference', 'short')
    })

    it('should show balanced as selected by default', () => {
      const formData = createMockFormData({ lengthPreference: 'short-to-medium' })
      render(<StyleStep formData={formData} updateField={vi.fn()} />)

      const balancedButton = screen.getByText('Balanced').closest('button')
      expect(balancedButton).toHaveClass('bg-studio-ink')
    })
  })

  describe('Nickname Tolerance', () => {
    it('should call updateField when selecting nickname preference', () => {
      const updateField = vi.fn()
      render(<StyleStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByText('Love nicknames'))

      expect(updateField).toHaveBeenCalledWith('nicknameTolerance', 'high')
    })

    it('should show medium as default selected', () => {
      const formData = createMockFormData({ nicknameTolerance: 'medium' })
      render(<StyleStep formData={formData} updateField={vi.fn()} />)

      const nicknamesWelcome = screen.getByText('Nicknames welcome').closest('button')
      expect(nicknamesWelcome).toHaveClass('border-studio-ink')
    })
  })
})
