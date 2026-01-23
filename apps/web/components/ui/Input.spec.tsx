import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Input, Textarea } from './Input'

describe('Input', () => {
  describe('Rendering', () => {
    it('should render an input element', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should render with label when provided', () => {
      render(<Input label="Name" id="name-input" />)
      expect(screen.getByLabelText('Name')).toBeInTheDocument()
    })

    it('should not render label when not provided', () => {
      render(<Input placeholder="No label" />)
      expect(screen.queryByRole('label')).not.toBeInTheDocument()
    })
  })

  describe('Label Animation', () => {
    it('should show floating label style when focused', () => {
      render(<Input label="Email" id="email" />)
      const input = screen.getByLabelText('Email')

      fireEvent.focus(input)

      const label = screen.getByText('Email')
      expect(label).toHaveClass('top-2', 'text-xs')
    })

    it('should show floating label style when has value', () => {
      render(<Input label="Email" id="email" value="test@example.com" onChange={() => {}} />)

      const label = screen.getByText('Email')
      expect(label).toHaveClass('top-2', 'text-xs')
    })

    it('should show placeholder label style when empty and not focused', () => {
      render(<Input label="Email" id="email" value="" onChange={() => {}} />)

      const label = screen.getByText('Email')
      expect(label).toHaveClass('top-1/2', '-translate-y-1/2')
    })
  })

  describe('Error State', () => {
    it('should display error message when error prop is provided', () => {
      render(<Input error="This field is required" />)
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('should apply error styles when error prop is provided', () => {
      render(<Input error="Error" placeholder="error-input" />)
      const input = screen.getByPlaceholderText('error-input')
      expect(input).toHaveClass('border-red-400')
    })

    it('should not display error message when no error', () => {
      render(<Input placeholder="no-error" />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Event Handlers', () => {
    it('should call onChange when value changes', () => {
      const handleChange = vi.fn()
      render(<Input onChange={handleChange} placeholder="input" />)

      fireEvent.change(screen.getByPlaceholderText('input'), {
        target: { value: 'new value' },
      })

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should call onFocus when focused', () => {
      const handleFocus = vi.fn()
      render(<Input onFocus={handleFocus} placeholder="input" />)

      fireEvent.focus(screen.getByPlaceholderText('input'))

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should call onBlur when blurred', () => {
      const handleBlur = vi.fn()
      render(<Input onBlur={handleBlur} placeholder="input" />)

      const input = screen.getByPlaceholderText('input')
      fireEvent.focus(input)
      fireEvent.blur(input)

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('Custom className', () => {
    it('should merge custom className', () => {
      render(<Input className="custom-input" placeholder="input" />)
      expect(screen.getByPlaceholderText('input')).toHaveClass('custom-input')
    })
  })
})

describe('Textarea', () => {
  describe('Rendering', () => {
    it('should render a textarea element', () => {
      render(<Textarea placeholder="Enter description" />)
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument()
    })

    it('should render with label when provided', () => {
      render(<Textarea label="Description" id="desc" />)
      expect(screen.getByLabelText('Description')).toBeInTheDocument()
    })
  })

  describe('Label Animation', () => {
    it('should show floating label style when focused', () => {
      render(<Textarea label="Notes" id="notes" />)
      const textarea = screen.getByLabelText('Notes')

      fireEvent.focus(textarea)

      const label = screen.getByText('Notes')
      expect(label).toHaveClass('top-2', 'text-xs')
    })

    it('should show floating label style when has value', () => {
      render(<Textarea label="Notes" id="notes" value="Some text" onChange={() => {}} />)

      const label = screen.getByText('Notes')
      expect(label).toHaveClass('top-2', 'text-xs')
    })
  })

  describe('Error State', () => {
    it('should display error message when error prop is provided', () => {
      render(<Textarea error="Description is required" />)
      expect(screen.getByText('Description is required')).toBeInTheDocument()
    })

    it('should apply error styles when error prop is provided', () => {
      render(<Textarea error="Error" placeholder="textarea" />)
      expect(screen.getByPlaceholderText('textarea')).toHaveClass('border-red-400')
    })
  })

  describe('Event Handlers', () => {
    it('should call onChange when value changes', () => {
      const handleChange = vi.fn()
      render(<Textarea onChange={handleChange} placeholder="textarea" />)

      fireEvent.change(screen.getByPlaceholderText('textarea'), {
        target: { value: 'new value' },
      })

      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('should call onFocus when focused', () => {
      const handleFocus = vi.fn()
      render(<Textarea onFocus={handleFocus} placeholder="textarea" />)

      fireEvent.focus(screen.getByPlaceholderText('textarea'))

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should call onBlur when blurred', () => {
      const handleBlur = vi.fn()
      render(<Textarea onBlur={handleBlur} placeholder="textarea" />)

      const textarea = screen.getByPlaceholderText('textarea')
      fireEvent.focus(textarea)
      fireEvent.blur(textarea)

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })
  })

  describe('Rows', () => {
    it('should accept rows prop', () => {
      render(<Textarea rows={5} placeholder="textarea" />)
      expect(screen.getByPlaceholderText('textarea')).toHaveAttribute('rows', '5')
    })
  })
})
