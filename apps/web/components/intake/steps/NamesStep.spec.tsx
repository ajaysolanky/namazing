import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NamesStep } from './NamesStep'
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

describe('NamesStep', () => {
  describe('Rendering', () => {
    it('should render step header', () => {
      render(<NamesStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Names on your mind')).toBeInTheDocument()
    })

    it('should render considering names section', () => {
      render(<NamesStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText(/names you're considering/i)).toBeInTheDocument()
    })

    it('should render avoid names section', () => {
      render(<NamesStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Names to avoid')).toBeInTheDocument()
    })
  })

  describe('Adding Considering Names', () => {
    it('should add name with notes', () => {
      const updateField = vi.fn()
      render(<NamesStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.change(screen.getByPlaceholderText('Name'), {
        target: { value: 'Luna' },
      })
      fireEvent.change(screen.getByPlaceholderText(/notes/i), {
        target: { value: 'Love the sound' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Add name' }))

      expect(updateField).toHaveBeenCalledWith('namesConsidering', [
        { name: 'Luna', notes: 'Love the sound' },
      ])
    })

    it('should add name without notes', () => {
      const updateField = vi.fn()
      render(<NamesStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.change(screen.getByPlaceholderText('Name'), {
        target: { value: 'Luna' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Add name' }))

      expect(updateField).toHaveBeenCalledWith('namesConsidering', [
        { name: 'Luna', notes: undefined },
      ])
    })

    it('should not add empty name', () => {
      const updateField = vi.fn()
      render(<NamesStep formData={createMockFormData()} updateField={updateField} />)

      fireEvent.click(screen.getByRole('button', { name: 'Add name' }))

      expect(updateField).not.toHaveBeenCalled()
    })
  })

  describe('Displaying Considering Names', () => {
    it('should display existing names', () => {
      const formData = createMockFormData({
        namesConsidering: [
          { name: 'Luna', notes: 'Pretty' },
          { name: 'Aria' },
        ],
      })
      render(<NamesStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('Luna')).toBeInTheDocument()
      expect(screen.getByText('Pretty')).toBeInTheDocument()
      expect(screen.getByText('Aria')).toBeInTheDocument()
    })
  })

  describe('Removing Considering Names', () => {
    it('should remove name when clicking remove button', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({
        namesConsidering: [{ name: 'Luna' }, { name: 'Aria' }],
      })
      const { container } = render(<NamesStep formData={formData} updateField={updateField} />)

      // Find all remove buttons with the X icon (close icon path)
      const removeButtons = container.querySelectorAll('button')
      // Filter to find buttons with the close icon
      const closeButtons = Array.from(removeButtons).filter(btn =>
        btn.querySelector('path[d*="M6 18L18 6"]')
      )
      // Click the first one (Luna's remove button)
      if (closeButtons[0]) fireEvent.click(closeButtons[0])

      expect(updateField).toHaveBeenCalledWith('namesConsidering', [{ name: 'Aria' }])
    })
  })

  describe('Adding Avoid Names', () => {
    it('should add name to avoid list', () => {
      const updateField = vi.fn()
      render(<NamesStep formData={createMockFormData()} updateField={updateField} />)

      const avoidInput = screen.getByPlaceholderText('Name to avoid')
      fireEvent.change(avoidInput, { target: { value: 'Keith' } })

      // Find the Add button next to the avoid input
      const addButtons = screen.getAllByRole('button', { name: 'Add' })
      fireEvent.click(addButtons[addButtons.length - 1])

      expect(updateField).toHaveBeenCalledWith('namesToAvoid', ['Keith'])
    })

    it('should add name on Enter key', () => {
      const updateField = vi.fn()
      render(<NamesStep formData={createMockFormData()} updateField={updateField} />)

      const avoidInput = screen.getByPlaceholderText('Name to avoid')
      fireEvent.change(avoidInput, { target: { value: 'Keith' } })
      fireEvent.keyDown(avoidInput, { key: 'Enter' })

      expect(updateField).toHaveBeenCalledWith('namesToAvoid', ['Keith'])
    })
  })

  describe('Displaying Avoid Names', () => {
    it('should display avoid names as tags', () => {
      const formData = createMockFormData({
        namesToAvoid: ['Keith', 'Karen'],
      })
      render(<NamesStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('Keith')).toBeInTheDocument()
      expect(screen.getByText('Karen')).toBeInTheDocument()
    })
  })

  describe('Removing Avoid Names', () => {
    it('should remove avoid name when clicking remove', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({
        namesToAvoid: ['Keith', 'Karen'],
      })
      render(<NamesStep formData={formData} updateField={updateField} />)

      // Find the Keith tag and its remove button
      const keithTag = screen.getByText('Keith').closest('span')
      const removeBtn = keithTag?.querySelector('button')
      if (removeBtn) fireEvent.click(removeBtn)

      expect(updateField).toHaveBeenCalledWith('namesToAvoid', ['Karen'])
    })
  })
})
