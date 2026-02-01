import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useIntakeForm, transformToSessionProfile, intakeFormSchema } from './useIntakeForm'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('useIntakeForm', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with default form data', () => {
      const { result } = renderHook(() => useIntakeForm())

      expect(result.current.formData.surname).toBe('')
      expect(result.current.formData.siblings).toEqual([])
      expect(result.current.formData.stylePreferences).toEqual([])
      expect(result.current.currentStep).toBe(0)
    })

    it('should set isLoaded to true after mount', async () => {
      const { result } = renderHook(() => useIntakeForm())

      // Wait for useEffect to run
      await vi.waitFor(() => {
        expect(result.current.isLoaded).toBe(true)
      })
    })

    it('should restore from localStorage if data exists', async () => {
      const savedData = {
        formData: { surname: 'Smith', siblings: [] },
        currentStep: 2,
      }
      localStorageMock.setItem('namazing-intake-form', JSON.stringify(savedData))

      const { result } = renderHook(() => useIntakeForm())

      await vi.waitFor(() => {
        expect(result.current.formData.surname).toBe('Smith')
        expect(result.current.currentStep).toBe(2)
      })
    })
  })

  describe('updateField', () => {
    it('should update a field value', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.updateField('surname', 'Johnson')
      })

      expect(result.current.formData.surname).toBe('Johnson')
    })

    it('should update array fields', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.updateField('stylePreferences', ['classic', 'modern'])
      })

      expect(result.current.formData.stylePreferences).toEqual(['classic', 'modern'])
    })
  })

  describe('Step Navigation', () => {
    it('should go to next step', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.nextStep()
      })

      expect(result.current.currentStep).toBe(1)
    })

    it('should go to previous step', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.nextStep()
        result.current.nextStep()
        result.current.prevStep()
      })

      expect(result.current.currentStep).toBe(1)
    })

    it('should not go below step 0', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.prevStep()
      })

      expect(result.current.currentStep).toBe(0)
    })

    it('should not go above step 6', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        for (let i = 0; i < 10; i++) {
          result.current.nextStep()
        }
      })

      expect(result.current.currentStep).toBe(6)
    })

    it('should go to specific step', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.goToStep(4)
      })

      expect(result.current.currentStep).toBe(4)
    })
  })

  describe('validateStep', () => {
    it('should validate step 0 (welcome) as always valid', () => {
      const { result } = renderHook(() => useIntakeForm())
      expect(result.current.validateStep(0)).toBe(true)
    })

    it('should validate step 1 (family) based on surname', async () => {
      const { result } = renderHook(() => useIntakeForm())

      expect(result.current.validateStep(1)).toBe(false)

      await act(async () => {
        result.current.updateField('surname', 'Smith')
      })

      expect(result.current.validateStep(1)).toBe(true)
    })

    it('should validate step 6 (review) based on surname', async () => {
      const { result } = renderHook(() => useIntakeForm())

      expect(result.current.validateStep(6)).toBe(false)

      await act(async () => {
        result.current.updateField('surname', 'Smith')
      })

      expect(result.current.validateStep(6)).toBe(true)
    })

    it('should return false for invalid step numbers', () => {
      const { result } = renderHook(() => useIntakeForm())
      expect(result.current.validateStep(99)).toBe(false)
    })
  })

  describe('resetForm', () => {
    it('should reset form to default values', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.updateField('surname', 'Smith')
        result.current.nextStep()
        result.current.nextStep()
      })

      await act(async () => {
        result.current.resetForm()
      })

      expect(result.current.formData.surname).toBe('')
      expect(result.current.currentStep).toBe(0)
    })

    it('should remove data from localStorage', async () => {
      const { result } = renderHook(() => useIntakeForm())

      await act(async () => {
        result.current.updateField('surname', 'Smith')
      })

      await act(async () => {
        result.current.resetForm()
      })

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('namazing-intake-form')
    })
  })
})

describe('intakeFormSchema', () => {
  it('should validate a complete form', () => {
    const validData = {
      babyGender: 'boy' as const,
      surname: 'Smith',
      siblings: [{ name: 'Emma', age: '3' }],
      stylePreferences: ['classic'],
      lengthPreference: 'short' as const,
      nicknameTolerance: 'medium' as const,
      namesConsidering: [{ name: 'Oliver', notes: 'Love it' }],
      namesToAvoid: ['John'],
      culturalConsiderations: ['English heritage'],
      familyTraditions: 'First son named after grandfather',
      honorNames: ['William'],
      additionalNotes: 'Looking for classic names',
    }

    const result = intakeFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should require surname', () => {
    const invalidData = {
      surname: '',
    }

    const result = intakeFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})

describe('transformToSessionProfile', () => {
  it('should transform form data to session profile', () => {
    const formData = {
      babyGender: 'girl' as const,
      surname: 'Smith',
      siblings: [{ name: 'Emma', age: '3' }],
      stylePreferences: ['classic', 'modern'],
      lengthPreference: 'short' as const,
      nicknameTolerance: 'high' as const,
      namesConsidering: [{ name: 'Luna', notes: 'Beautiful' }],
      namesToAvoid: ['Karen'],
      culturalConsiderations: ['Irish heritage'],
      familyTraditions: 'Family tradition',
      honorNames: ['Rose'],
      middleNameBoy: '',
      middleNameGirl: '',
      additionalNotes: 'Extra notes',
    }

    const profile = transformToSessionProfile(formData)

    expect(profile.family.surname).toBe('Smith')
    expect(profile.family.siblings).toEqual(['Emma'])
    expect(profile.family.honor_names).toEqual(['Rose'])
    expect(profile.preferences.naming_themes).toContain('classic')
    expect(profile.preferences.naming_themes).toContain('modern')
    expect(profile.preferences.nickname_tolerance).toBe('high')
    expect(profile.vetoes.hard).toEqual(['Karen'])
    expect(profile.raw_brief).toContain('girl names')
    expect(profile.raw_brief).toContain('Smith')
  })

  it('should handle unknown gender', () => {
    const formData = {
      babyGender: 'unknown' as const,
      surname: 'Jones',
      siblings: [],
      stylePreferences: [],
      lengthPreference: 'any' as const,
      nicknameTolerance: 'medium' as const,
      namesConsidering: [],
      namesToAvoid: [],
      culturalConsiderations: [],
      familyTraditions: '',
      honorNames: [],
      middleNameBoy: '',
      middleNameGirl: '',
      additionalNotes: '',
    }

    const profile = transformToSessionProfile(formData)

    expect(profile.raw_brief).toContain('gender unknown or flexible')
  })

  it('should handle empty optional fields', () => {
    const formData = {
      babyGender: undefined,
      surname: 'Brown',
      siblings: [],
      stylePreferences: [],
      lengthPreference: 'any' as const,
      nicknameTolerance: 'medium' as const,
      namesConsidering: [],
      namesToAvoid: [],
      culturalConsiderations: [],
      familyTraditions: '',
      honorNames: [],
      middleNameBoy: '',
      middleNameGirl: '',
      additionalNotes: '',
    }

    const profile = transformToSessionProfile(formData)

    expect(profile.family.surname).toBe('Brown')
    expect(profile.family.siblings).toEqual([])
    expect(profile.preferences.naming_themes).toEqual([])
  })
})
