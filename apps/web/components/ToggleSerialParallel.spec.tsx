import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ToggleSerialParallel } from './ToggleSerialParallel'

describe('ToggleSerialParallel', () => {
  it('renders both options', () => {
    render(<ToggleSerialParallel mode="serial" onChange={() => {}} />)
    
    expect(screen.getByRole('button', { name: /serial/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /parallel/i })).toBeInTheDocument()
  })

  it('indicates active state correctly', () => {
    const { rerender } = render(<ToggleSerialParallel mode="serial" onChange={() => {}} />)
    
    // Check serial is active (based on class checking or just visually in real DOM, 
    // here we might check class for 'bg-studio-ink')
    const serialBtn = screen.getByRole('button', { name: /serial/i })
    expect(serialBtn.className).toContain('bg-studio-ink')
    
    rerender(<ToggleSerialParallel mode="parallel" onChange={() => {}} />)
    const parallelBtn = screen.getByRole('button', { name: /parallel/i })
    expect(parallelBtn.className).toContain('bg-studio-ink')
  })

  it('calls onChange when clicked', () => {
    const handleChange = vi.fn()
    render(<ToggleSerialParallel mode="serial" onChange={handleChange} />)
    
    fireEvent.click(screen.getByRole('button', { name: /parallel/i }))
    expect(handleChange).toHaveBeenCalledWith('parallel')
    
    fireEvent.click(screen.getByRole('button', { name: /serial/i }))
    expect(handleChange).toHaveBeenCalledWith('serial')
  })
})
