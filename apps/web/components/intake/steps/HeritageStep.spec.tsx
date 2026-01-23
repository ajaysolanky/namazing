import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HeritageStep } from './HeritageStep'
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

describe('HeritageStep', () => {
  describe('Rendering', () => {
    it('should render step header', () => {
      render(<HeritageStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Roots & traditions')).toBeInTheDocument()
    })

    it('should render cultural backgrounds section', () => {
      render(<HeritageStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Cultural backgrounds to explore')).toBeInTheDocument()
    })

    it('should render region groups', () => {
      render(<HeritageStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('British Isles')).toBeInTheDocument()
      expect(screen.getByText('Western Europe')).toBeInTheDocument()
      expect(screen.getByText('Nordic & Eastern')).toBeInTheDocument()
      expect(screen.getByText('Asia')).toBeInTheDocument()
    })

    it('should render honor names section', () => {
      render(<HeritageStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Anyone to honor?')).toBeInTheDocument()
    })

    it('should render family traditions section', () => {
      render(<HeritageStep formData={createMockFormData()} updateField={vi.fn()} />)
      expect(screen.getByText('Family naming traditions')).toBeInTheDocument()
    })
  })

  describe('Culture Selection', () => {
    it('should expand region when clicking', () => {
      render(<HeritageStep formData={createMockFormData()} updateField={vi.fn()} />)

      fireEvent.click(screen.getByText('British Isles'))

      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('Irish')).toBeInTheDocument()
      expect(screen.getByText('Scottish')).toBeInTheDocument()
      expect(screen.getByText('Welsh')).toBeInTheDocument()
    })

    it('should toggle culture when clicking', () => {
      const updateField = vi.fn()
      render(<HeritageStep formData={createMockFormData()} updateField={updateField} />)

      // Expand British Isles
      fireEvent.click(screen.getByText('British Isles'))
      // Select Irish
      fireEvent.click(screen.getByText('Irish'))

      expect(updateField).toHaveBeenCalledWith('culturalConsiderations', ['Irish'])
    })

    it('should remove culture when clicking selected culture', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({ culturalConsiderations: ['Irish', 'English'] })
      render(<HeritageStep formData={formData} updateField={updateField} />)

      // Click Irish tag to remove it
      const irishTags = screen.getAllByText('Irish')
      const removeBtn = irishTags[0].closest('span')?.querySelector('button')
      if (removeBtn) fireEvent.click(removeBtn)

      expect(updateField).toHaveBeenCalledWith('culturalConsiderations', ['English'])
    })
  })

  describe('Custom Culture', () => {
    it('should add custom culture', () => {
      const updateField = vi.fn()
      render(<HeritageStep formData={createMockFormData()} updateField={updateField} />)

      const customInput = screen.getByPlaceholderText('Add another heritage...')
      fireEvent.change(customInput, { target: { value: 'Brazilian' } })
      fireEvent.click(screen.getAllByText('Add')[0])

      expect(updateField).toHaveBeenCalledWith('culturalConsiderations', ['Brazilian'])
    })

    it('should add custom culture on Enter', () => {
      const updateField = vi.fn()
      render(<HeritageStep formData={createMockFormData()} updateField={updateField} />)

      const customInput = screen.getByPlaceholderText('Add another heritage...')
      fireEvent.change(customInput, { target: { value: 'Brazilian' } })
      fireEvent.keyDown(customInput, { key: 'Enter' })

      expect(updateField).toHaveBeenCalledWith('culturalConsiderations', ['Brazilian'])
    })
  })

  describe('Honor Names', () => {
    it('should add honor name', () => {
      const updateField = vi.fn()
      render(<HeritageStep formData={createMockFormData()} updateField={updateField} />)

      const honorInput = screen.getByPlaceholderText('Name of person to honor')
      fireEvent.change(honorInput, { target: { value: 'Grandma Rose' } })
      fireEvent.click(screen.getAllByText('Add')[1])

      expect(updateField).toHaveBeenCalledWith('honorNames', ['Grandma Rose'])
    })

    it('should display existing honor names', () => {
      const formData = createMockFormData({ honorNames: ['Grandma Rose', 'Uncle Jim'] })
      render(<HeritageStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByText('Grandma Rose')).toBeInTheDocument()
      expect(screen.getByText('Uncle Jim')).toBeInTheDocument()
    })

    it('should remove honor name', () => {
      const updateField = vi.fn()
      const formData = createMockFormData({ honorNames: ['Grandma Rose', 'Uncle Jim'] })
      render(<HeritageStep formData={formData} updateField={updateField} />)

      const roseTag = screen.getByText('Grandma Rose').closest('span')
      const removeBtn = roseTag?.querySelector('button')
      if (removeBtn) fireEvent.click(removeBtn)

      expect(updateField).toHaveBeenCalledWith('honorNames', ['Uncle Jim'])
    })
  })

  describe('Family Traditions', () => {
    it('should update family traditions textarea', () => {
      const updateField = vi.fn()
      render(<HeritageStep formData={createMockFormData()} updateField={updateField} />)

      const textarea = screen.getByPlaceholderText(/all boys have j names/i)
      fireEvent.change(textarea, { target: { value: 'First sons get middle name James' } })

      expect(updateField).toHaveBeenCalledWith('familyTraditions', 'First sons get middle name James')
    })

    it('should display existing traditions', () => {
      const formData = createMockFormData({ familyTraditions: 'Named after grandparents' })
      render(<HeritageStep formData={formData} updateField={vi.fn()} />)

      expect(screen.getByDisplayValue('Named after grandparents')).toBeInTheDocument()
    })
  })
})
