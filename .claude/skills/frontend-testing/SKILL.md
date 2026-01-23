# Namazing Frontend Testing Skill

## Core Purpose
This skill equips Claude to generate comprehensive **Vitest + React Testing Library** tests for Namazing frontend components, hooks, and utilities, following the project's established conventions.

## When to Use This Skill
Apply when users request:
- Test generation for components, hooks, or utilities
- Test coverage reviews or improvements
- Vitest/React Testing Library guidance
- Understanding Namazing's testing patterns

**Skip this skill** for backend tests, E2E tests, or purely conceptual questions without code context.

## Key Tech Stack
- **Vitest 4.0.17** - Test runner
- **React Testing Library 16.3** - Component testing
- **jsdom** - Test environment
- **React 18.3** + **Next.js 14.2**

## Critical Workflow Rule
"NEVER generate all test files at once. For complex components or multi-file directories: 1) Analyze & Plan, 2) Process ONE at a time, 3) Verify before proceeding." Test files must pass individually before moving to the next.

## Essential Testing Principles
1. **AAA Pattern**: Arrange test setup, Act on the component, Assert outcomes
2. **Black-box testing**: Verify observable behavior using semantic queries (getByRole, getByLabelText)
3. **Single behavior per test**: Each test checks one user-observable behavior
4. **Semantic naming**: Use "should [behavior] when [condition]" format

## Required Test Coverage
Always include: rendering tests, prop validation, and edge cases (null, undefined, empty values). Aim for 100% function/statement coverage and >95% branch/line coverage per file.

## Authority
This skill derives from `apps/web/testing/testing.md` in the Namazing project—the canonical testing specification.

## Project-Specific Notes

### Components to Test
- `components/` - Core UI components (NameCard, ProgressTracker, etc.)
- `components/intake/` - Intake wizard and step components
- `components/processing/` - Processing view components
- `components/report/` - Report display components
- `components/ui/` - Reusable UI primitives (Button, Card, Dialog, etc.)
- `components/layout/` - Layout components (Container, Header, Footer)
- `hooks/` - Custom React hooks
- `lib/` - Utility functions

### Mocking Strategy
- Mock `next/navigation` globally in vitest.setup.tsx
- Mock `framer-motion` to avoid animation issues
- Mock API calls (`lib/api.ts`) and SSE (`lib/sse.ts`)
- DO NOT mock UI primitives from `components/ui/`
- DO NOT mock sibling components in the same directory
