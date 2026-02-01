import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { FamilyStep } from './FamilyStep'
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

describe('FamilyStep', () => {
  describe('Rendering', () => {
    it('should render step header', () => {
      render(<FamilyStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Tell us about your family')).toBeInTheDocument()
    })

    it('should render surname input', () => {
      render(<FamilyStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByLabelText('Family surname')).toBeInTheDocument()
    })

    it('should render siblings section', () => {
      render(<FamilyStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Siblings (if any)')).toBeInTheDocument()
    })

    it('should render add sibling form', () => {
      render(<FamilyStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Age')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument()
    })
  })

  describe('Surname Input', () => {
    it('should display current surname value', () => {
      const formData = createMockFormData({ surname: 'Johnson' })
      render(<FamilyStep formData={formData} updateField={vi.fn()} />)
      expect(screen.getByLabelText('Family surname')).toHaveValue('Johnson')
    })

    it('should call updateField when surname changes', () => {
      const updateField = vi.fn()
      render(<FamilyStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.change(screen.getByLabelText('Family surname'), {
        target: { value: 'Smith' },
      })

      expect(updateField).toHaveBeenCalledWith('surname', 'Smith')
    })
  })

  describe('Adding Siblings', () => {
    it('should add sibling when clicking Add button', () => {
      const updateField = vi.fn()
      render(<FamilyStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.change(screen.getByPlaceholderText('Name'), {
        target: { value: 'Emma' },
      })
      fireEvent.change(screen.getByPlaceholderText('Age'), {
        target: { value: '5' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      expect(updateField).toHaveBeenCalledWith('siblings', [{ name: 'Emma', age: '5' }])
    })

    it('should add sibling on Enter key in name field', () => {
      const updateField = vi.fn()
      render(<FamilyStep formData={createMockFormData()} updateField={updateField} />)

      const nameInput = screen.getByPlaceholderText('Name')
      fireEvent.change(nameInput, { target: { value: 'Jack' } })
      fireEvent.keyDown(nameInput, { key: 'Enter' })

      expect(updateField).toHaveBeenCalledWith('siblings', [{ name: 'Jack', age: '' }])
    })

    it('should not add sibling with empty name', () => {
      const updateField = vi.fn()
      render(<FamilyStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      expect(updateField).not.toHaveBeenCalled()
    })

    it('should clear input fields after adding sibling', () => {
      render(<FamilyStep formData={createMockFormData()} updateField={vi.fn()} />)

      const nameInput = screen.getByPlaceholderText('Name')
      const ageInput = screen.getByPlaceholderText('Age')

      fireEvent.change(nameInput, { target: { value: 'Emma' } })
      fireEvent.change(ageInput, { target: { value: '5' } })
      fireEvent.click(screen.getByRole('button', { name: 'Add' }))

      expect(nameInput).toHaveValue('')
      expect(ageInput).toHaveValue('')
    })
  })

  describe('Displaying Siblings', () => {
    it('should display existing siblings', () => {
      const formData = createMockFormData({
        siblings: [
          { name: 'Emma', age: '5' },
          { name: 'Jack', age: '3' },
        ],
      })
      render(<FamilyStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('Emma')).toBeInTheDocument()
      expect(screen.getByText('(5)')).toBeInTheDocument()
      expect(screen.getByText('Jack')).toBeInTheDocument()
      expect(screen.getByText('(3)')).toBeInTheDocument()
    })

    it('should display sibling without age', () => {
      const formData = createMockFormData({
        siblings: [{ name: 'Emma', age: '' }],
      })
      render(<FamilyStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('Emma')).toBeInTheDocument()
      expect(screen.queryByText('()')).not.toBeInTheDocument()
    })
  })

  describe('Removing Siblings', () => {
    it('should remove sibling when clicking remove button', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({
        siblings: [
          { name: 'Emma', age: '5' },
          { name: 'Jack', age: '3' },
        ],
      })
      render(<FamilyStep formData={formData} updateField={updateField} />)

      // Find remove buttons (X buttons)
      const removeButtons = screen.getAllByRole('button').filter(
        (btn) => btn.querySelector('svg path[d*="M6 18L18 6"]')
      )
      fireEvent.click(removeButtons[0])

      expect(updateField).toHaveBeenCalledWith('siblings', [{ name: 'Jack', age: '3' }])
    })
  })
})
