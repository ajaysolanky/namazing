import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  const steps = ['Welcome', 'Family', 'Style', 'Names', 'Heritage', 'Details', 'Review']

  describe('Rendering', () => {
    it('should render current step label on mobile view', () => {
      render(<ProgressIndicator currentStep={0} />)
      // The Welcome label appears in both mobile and desktop views
      expect(screen.getAllByText('Welcome').length).toBeGreaterThan(0)
    })

    it('should render step counter on mobile', () => {
      render(<ProgressIndicator currentStep={2} />)
      // Mobile shows "Step 3 of 7"
      expect(screen.getByText(/Step 3 of 7/)).toBeInTheDocument()
    })

    it('should render all step labels on desktop', () => {
      render(<ProgressIndicator currentStep={0} />)
      steps.forEach((step) => {
        expect(screen.getAllByText(step).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Step States', () => {
    it('should show step 1 as current when currentStep is 0', () => {
      render(<ProgressIndicator currentStep={0} />)
      // Current step shows label prominently
      const welcomeLabels = screen.getAllByText('Welcome')
      expect(welcomeLabels.length).toBeGreaterThan(0)
    })

    it('should display correct step number for non-completed steps', () => {
      render(<ProgressIndicator currentStep={2} />)
      // Steps after current show their number
      expect(screen.getByText('4')).toBeInTheDocument() // Names step
    })
  })

  describe('Step Click Handler', () => {
    it('should call onStepClick when clicking a completed step', () => {
      const handleStepClick = vi.fn()
      render(<ProgressIndicator currentStep={3} onStepClick={handleStepClick} />)

      // Find and click a completed step (step 0 - Welcome)
      const buttons = screen.getAllByRole('button')
      // The first button should be the Welcome step
      fireEvent.click(buttons[0])

      expect(handleStepClick).toHaveBeenCalledWith(0)
    })

    it('should call onStepClick when clicking current step', () => {
      const handleStepClick = vi.fn()
      render(<ProgressIndicator currentStep={2} onStepClick={handleStepClick} />)

      const buttons = screen.getAllByRole('button')
      // Click the current step (index 2)
      fireEvent.click(buttons[2])

      expect(handleStepClick).toHaveBeenCalledWith(2)
    })

    it('should not call onStepClick when clicking future step', () => {
      const handleStepClick = vi.fn()
      render(<ProgressIndicator currentStep={2} onStepClick={handleStepClick} />)

      const buttons = screen.getAllByRole('button')
      // Click a future step (index 4 - Heritage)
      fireEvent.click(buttons[4])

      expect(handleStepClick).not.toHaveBeenCalled()
    })

    it('should disable future steps', () => {
      render(<ProgressIndicator currentStep={2} onStepClick={vi.fn()} />)

      const buttons = screen.getAllByRole('button')
      // Future steps should be disabled
      expect(buttons[4]).toBeDisabled()
      expect(buttons[5]).toBeDisabled()
      expect(buttons[6]).toBeDisabled()
    })
  })

  describe('Progress Bar', () => {
    it('should render mobile progress bar', () => {
      const { container } = render(<ProgressIndicator currentStep={3} />)
      // Mobile progress uses a flow-bar class or rounded-full for the container
      const progressBar = container.querySelector('.rounded-full')
      expect(progressBar).toBeInTheDocument()
    })
  })

  describe('Without onStepClick', () => {
    it('should render without click handler', () => {
      render(<ProgressIndicator currentStep={2} />)
      // Should render without errors - Style appears multiple times
      expect(screen.getAllByText('Style').length).toBeGreaterThan(0)
    })

    it('should disable all step buttons when no onStepClick', () => {
      render(<ProgressIndicator currentStep={2} />)
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toBeDisabled()
      })
    })
  })
})
