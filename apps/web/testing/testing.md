# Frontend Testing Guide

This document is the complete testing specification for the Namazing frontend project.
Goal: Readable, change-friendly, reusable, and debuggable tests.

## Tech Stack

- **Framework**: Next.js 14.2 + React 18.3 + TypeScript
- **Testing Tools**: Vitest 4.0.17 + React Testing Library 16.3
- **Test Environment**: jsdom
- **File Naming**: `ComponentName.spec.tsx` (same directory as component)

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific file
npm test -- path/to/file.spec.tsx
```

## Project Test Setup

- **Configuration**: `vitest.config.ts` sets the `jsdom` environment and path aliases (`@/...`).
- **Global setup**: `vitest.setup.tsx` imports `@testing-library/jest-dom`, runs `cleanup()` after every test, and defines shared mocks for `next/navigation`, `framer-motion`, `ResizeObserver`, and `IntersectionObserver`.

## Test Authoring Principles

- **Single behavior per test**: Each test verifies one user-observable behavior.
- **Black-box first**: Assert external behavior and observable outputs, avoid internal implementation details.
- **Semantic naming**: Use `should <behavior> when <condition>` and group related cases with `describe(<subject>)`.
- **AAA Pattern**: Separate Arrange, Act, and Assert clearly.
- **Minimal but sufficient assertions**: Keep only expectations that express the essence of the behavior.
- **Fast & stable**: Keep unit tests running in milliseconds.

## Basic Guidelines

- ✅ AAA pattern: Arrange (setup) → Act (execute) → Assert (verify)
- ✅ Descriptive test names: `"should [behavior] when [condition]"`
- ✅ TypeScript: No `any` types (except edge case testing)
- ✅ **Cleanup**: `vi.clearAllMocks()` in `beforeEach()`, not `afterEach()`

## Test Scenarios

### 1. Rendering Tests (REQUIRED - All Components)

- Verify component renders without crashing
- Check key elements exist
- Use semantic queries (getByRole, getByLabelText, getByText)

### 2. Props Testing (REQUIRED - All Components)

- Test required props
- Test optional props with defaults
- Test prop combinations that change behavior

### 3. State Management

- Test initial state
- Test state transitions via user interactions
- Use `waitFor()` for async state changes

### 4. Event Handlers

- Test click, change, submit events
- Test keyboard interactions where applicable
- Verify callbacks are called with correct arguments

### 5. Edge Cases (REQUIRED - All Components)

- ✅ null/undefined/empty values
- ✅ Boundary conditions
- ✅ Error states
- ✅ Loading states

### 6. API Calls and Async Operations

- ✅ Mock all API calls using `vi.mock`
- ✅ Test loading, success, and error states
- ✅ Use `waitFor()` for async operations

## Mocking Strategy

### What to Mock
- External API calls (`lib/api.ts`)
- SSE subscriptions (`lib/sse.ts`)
- `next/navigation` (already in setup)
- `framer-motion` (already in setup)

### What NOT to Mock
- UI primitives from `components/ui/`
- Sibling components in the same directory
- Base components used across the app

## Example Structure

```tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ComponentName } from './ComponentName'

// Mock external dependencies only
vi.mock('@/lib/api')

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<ComponentName />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should handle click events', () => {
      const handleClick = vi.fn()
      render(<ComponentName onClick={handleClick} />)

      fireEvent.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      render(<ComponentName data={[]} />)
      expect(screen.getByText(/no data/i)).toBeInTheDocument()
    })
  })
})
```

## Finding Elements (Priority Order)

1. `getByRole` - Most recommended, follows accessibility
2. `getByLabelText` - Form fields
3. `getByPlaceholderText` - Only when no label
4. `getByText` - Non-interactive elements
5. `getByTestId` - Only as last resort

## Coverage Goals

- ✅ 100% function coverage
- ✅ 100% statement coverage
- ✅ >95% branch coverage
- ✅ >95% line coverage

## Namazing-Specific Components

### Intake Wizard (`components/intake/`)
- Test step navigation
- Test form validation per step
- Test data persistence between steps

### Processing Components (`components/processing/`)
- Test SSE event handling
- Test progress updates
- Test stage transitions

### Report Components (`components/report/`)
- Test finalist display
- Test modal interactions
- Test export functionality

### UI Primitives (`components/ui/`)
- Test all variant combinations
- Test accessibility attributes
- Test keyboard navigation
