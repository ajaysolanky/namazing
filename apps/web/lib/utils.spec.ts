import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn (className utility)', () => {
  describe('Basic Usage', () => {
    it('should merge single class names', () => {
      expect(cn('foo')).toBe('foo')
    })

    it('should merge multiple class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })

    it('should handle null values', () => {
      expect(cn('foo', null, 'bar')).toBe('foo bar')
    })

    it('should handle empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar')
    })

    it('should handle boolean values', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
      expect(cn('foo', true && 'bar', 'baz')).toBe('foo bar baz')
    })
  })

  describe('Tailwind Merge', () => {
    it('should merge conflicting tailwind classes', () => {
      // Later class should win
      expect(cn('px-2', 'px-4')).toBe('px-4')
    })

    it('should merge padding classes correctly', () => {
      expect(cn('p-4', 'px-6')).toBe('p-4 px-6')
    })

    it('should merge text color classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })

    it('should merge background classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })

    it('should preserve non-conflicting classes', () => {
      expect(cn('px-2', 'py-4', 'bg-red-500')).toBe('px-2 py-4 bg-red-500')
    })
  })

  describe('Conditional Classes', () => {
    it('should handle object notation', () => {
      expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz')
    })

    it('should handle mixed string and object', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active')
    })

    it('should handle arrays', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar')
    })

    it('should handle nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz')
    })
  })

  describe('Edge Cases', () => {
    it('should handle no arguments', () => {
      expect(cn()).toBe('')
    })

    it('should handle all falsy values', () => {
      expect(cn(undefined, null, false, '')).toBe('')
    })

    it('should handle falsy number 0', () => {
      // clsx treats 0 as falsy, so it's excluded
      expect(cn('foo', 0)).toBe('foo')
    })
  })

  describe('Real-world Examples', () => {
    it('should merge component base with conditional classes', () => {
      const isActive = true
      const isDisabled = false
      const result = cn(
        'rounded-lg p-4 transition-colors',
        isActive && 'bg-blue-500 text-white',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )
      expect(result).toBe('rounded-lg p-4 transition-colors bg-blue-500 text-white')
    })

    it('should merge variant classes correctly', () => {
      const baseClasses = 'px-4 py-2 rounded font-medium'
      const variantClasses = 'bg-primary text-white px-6'
      const result = cn(baseClasses, variantClasses)
      expect(result).toBe('py-2 rounded font-medium bg-primary text-white px-6')
    })
  })
})
