import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IntakeWizard } from './IntakeWizard'

// Mock the hooks
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

const mockNextStep = vi.fn()
const mockPrevStep = vi.fn()
const mockGoToStep = vi.fn()
const mockResetForm = vi.fn()
const mockUpdateField = vi.fn()

let mockIsLoaded = true
let mockCurrentStep = 0
let mockFormData = {
  babyGender: undefined,
  surname: 'Smith',
  siblings: [],
  stylePreferences: [],
  lengthPreference: 'any' as const,
  nicknameTolerance: 'medium' as const,
  namesConsidering: [],
  namesToAvoid: [],
  culturalConsiderations: [],
  familyTraditions: '',
  honorNames: [],
  additionalNotes: '',
}

vi.mock('@/hooks/useIntakeForm', () => ({
  useIntakeForm: () => ({
    formData: mockFormData,
    currentStep: mockCurrentStep,
    isLoaded: mockIsLoaded,
    updateField: mockUpdateField,
    nextStep: mockNextStep,
    prevStep: mockPrevStep,
    goToStep: mockGoToStep,
    resetForm: mockResetForm,
    validateStep: (step: number) => {
      if (step === 1 || step === 6) return mockFormData.surname.length > 0
      return true
    },
  }),
  transformToSessionProfile: () => ({ raw_brief: 'Test brief' }),
}))

const mockStartRun = vi.fn()
vi.mock('@/lib/api', () => ({
  startRun: () => mockStartRun(),
}))

// Mock step components
vi.mock('./steps/WelcomeStep', () => ({
  WelcomeStep: () => <div data-testid="welcome-step">Welcome Step</div>,
}))
vi.mock('./steps/FamilyStep', () => ({
  FamilyStep: () => <div data-testid="family-step">Family Step</div>,
}))
vi.mock('./steps/StyleStep', () => ({
  StyleStep: () => <div data-testid="style-step">Style Step</div>,
}))
vi.mock('./steps/NamesStep', () => ({
  NamesStep: () => <div data-testid="names-step">Names Step</div>,
}))
vi.mock('./steps/HeritageStep', () => ({
  HeritageStep: () => <div data-testid="heritage-step">Heritage Step</div>,
}))
vi.mock('./steps/FreeformStep', () => ({
  FreeformStep: () => <div data-testid="freeform-step">Freeform Step</div>,
}))
vi.mock('./steps/ReviewStep', () => ({
  ReviewStep: () => <div data-testid="review-step">Review Step</div>,
}))
vi.mock('./ProgressIndicator', () => ({
  ProgressIndicator: ({ currentStep }: { currentStep: number }) => (
    <div data-testid="progress-indicator">Step {currentStep}</div>
  ),
}))
vi.mock('@/components/ui/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))
vi.mock('@/components/layout/Container', () => ({
  Container: ({ children }: any) => <div>{children}</div>,
}))

describe('IntakeWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsLoaded = true
    mockCurrentStep = 0
    mockFormData = {
      babyGender: undefined,
      surname: 'Smith',
      siblings: [],
      stylePreferences: [],
      lengthPreference: 'any' as const,
      nicknameTolerance: 'medium' as const,
      namesConsidering: [],
      namesToAvoid: [],
      culturalConsiderations: [],
      familyTraditions: '',
      honorNames: [],
      additionalNotes: '',
    }
    mockStartRun.mockResolvedValue({ runId: 'test-run-123' })
  })

  describe('Loading State', () => {
    it('should show loading spinner when not loaded', () => {
      mockIsLoaded = false
      render(<IntakeWizard />)

      expect(document.querySelector('.animate-spin')).toBeInTheDocument()
    })
  })

  describe('Step Rendering', () => {
    it('should render welcome step by default', () => {
      mockCurrentStep = 0
      render(<IntakeWizard />)
      expect(screen.getByTestId('welcome-step')).toBeInTheDocument()
    })

    it('should render family step when currentStep is 1', () => {
      mockCurrentStep = 1
      render(<IntakeWizard />)
      expect(screen.getByTestId('family-step')).toBeInTheDocument()
    })

    it('should render style step when currentStep is 2', () => {
      mockCurrentStep = 2
      render(<IntakeWizard />)
      expect(screen.getByTestId('style-step')).toBeInTheDocument()
    })

    it('should render names step when currentStep is 3', () => {
      mockCurrentStep = 3
      render(<IntakeWizard />)
      expect(screen.getByTestId('names-step')).toBeInTheDocument()
    })

    it('should render heritage step when currentStep is 4', () => {
      mockCurrentStep = 4
      render(<IntakeWizard />)
      expect(screen.getByTestId('heritage-step')).toBeInTheDocument()
    })

    it('should render freeform step when currentStep is 5', () => {
      mockCurrentStep = 5
      render(<IntakeWizard />)
      expect(screen.getByTestId('freeform-step')).toBeInTheDocument()
    })

    it('should render review step when currentStep is 6', () => {
      mockCurrentStep = 6
      render(<IntakeWizard />)
      expect(screen.getByTestId('review-step')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('should not show Back button on first step', () => {
      mockCurrentStep = 0
      render(<IntakeWizard />)
      expect(screen.queryByText('Back')).not.toBeInTheDocument()
    })

    it('should show Back button on subsequent steps', () => {
      mockCurrentStep = 1
      render(<IntakeWizard />)
      expect(screen.getByText('Back')).toBeInTheDocument()
    })

    it('should show Continue button on non-final steps', () => {
      mockCurrentStep = 0
      render(<IntakeWizard />)
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })

    it('should show Start consultation button on final step', () => {
      mockCurrentStep = 6
      render(<IntakeWizard />)
      expect(screen.getByText('Start consultation')).toBeInTheDocument()
    })

    it('should call nextStep when Continue clicked', () => {
      mockCurrentStep = 0
      render(<IntakeWizard />)

      fireEvent.click(screen.getByText('Continue'))

      expect(mockNextStep).toHaveBeenCalled()
    })

    it('should call prevStep when Back clicked', () => {
      mockCurrentStep = 2
      render(<IntakeWizard />)

      fireEvent.click(screen.getByText('Back'))

      expect(mockPrevStep).toHaveBeenCalled()
    })
  })

  describe('Form Submission', () => {
    it('should submit form and redirect on success', async () => {
      mockCurrentStep = 6
      render(<IntakeWizard />)

      fireEvent.click(screen.getByText('Start consultation'))

      await waitFor(() => {
        expect(mockStartRun).toHaveBeenCalled()
        expect(mockResetForm).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/processing/test-run-123')
      })
    })

    it('should show error message on submission failure', async () => {
      mockCurrentStep = 6
      mockStartRun.mockRejectedValueOnce(new Error('Network error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      render(<IntakeWizard />)
      fireEvent.click(screen.getByText('Start consultation'))

      await waitFor(() => {
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })

    it('should show loading state during submission', async () => {
      mockCurrentStep = 6
      mockStartRun.mockImplementation(() => new Promise(() => {})) // Never resolves

      render(<IntakeWizard />)
      fireEvent.click(screen.getByText('Start consultation'))

      await waitFor(() => {
        // Now shows a full-screen loading state
        expect(screen.getByText('Starting your consultation')).toBeInTheDocument()
      })
    })
  })

  describe('Progress Indicator', () => {
    it('should render progress indicator container', () => {
      render(<IntakeWizard />)
      // The component renders a progress indicator section
      expect(document.querySelector('.bg-white\\/50')).toBeInTheDocument()
    })
  })

  describe('Validation', () => {
    it('should disable Continue when step is invalid', () => {
      mockCurrentStep = 1
      mockFormData = { ...mockFormData, surname: '' }

      render(<IntakeWizard />)

      const continueButton = screen.getByText('Continue')
      expect(continueButton).toBeDisabled()
    })

    it('should enable Continue when step is valid', () => {
      mockCurrentStep = 1
      mockFormData = { ...mockFormData, surname: 'Smith' }

      render(<IntakeWizard />)

      const continueButton = screen.getByText('Continue')
      expect(continueButton).not.toBeDisabled()
    })
  })
})
