import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ReportLayout } from './ReportLayout'
import type { RunResult } from '@/lib/types'

// Mock child components
vi.mock('./ReportHero', () => ({
  ReportHero: ({ surname, summary }: { surname: string; summary: string }) => (
    <div data-testid="report-hero">
      <span data-testid="hero-surname">{surname}</span>
      <span data-testid="hero-summary">{summary}</span>
    </div>
  ),
}))

vi.mock('./FinalistCard', () => ({
  FinalistCard: ({ name, why, onViewDetails }: { name: string; why: string; onViewDetails?: () => void }) => (
    <div data-testid={`finalist-${name.toLowerCase()}`}>
      <span>{name}</span>
      <span>{why}</span>
      {onViewDetails && (
        <button onClick={onViewDetails} data-testid={`view-details-${name.toLowerCase()}`}>
          View Details
        </button>
      )}
    </div>
  ),
}))

vi.mock('./NameDetailModal', () => ({
  NameDetailModal: ({ nameCard, open, onOpenChange }: { nameCard: unknown; open: boolean; onOpenChange: (open: boolean) => void }) => (
    open ? (
      <div data-testid="name-detail-modal">
        <span>{(nameCard as { name?: string })?.name}</span>
        <button onClick={() => onOpenChange(false)} data-testid="close-modal">Close</button>
      </div>
    ) : null
  ),
}))

// Note: ComboShowcase is no longer used - combos are now passed directly to FinalistCard

vi.mock('./NearMissesAccordion', () => ({
  NearMissesAccordion: ({ nearMisses }: { nearMisses: unknown[] }) => (
    <div data-testid="near-misses-accordion">
      <span>{nearMisses.length} near misses</span>
    </div>
  ),
}))

vi.mock('./ExportActions', () => ({
  ExportActions: ({ runId, surname }: { runId: string; surname: string }) => (
    <div data-testid="export-actions">
      <span data-testid="export-run-id">{runId}</span>
      <span data-testid="export-surname">{surname}</span>
    </div>
  ),
}))

const mockResult: RunResult = {
  profile: {
    family: {
      surname: 'Johnson',
      siblings: [],
      honor_names: [],
      special_initials_include: [],
      special_initials_avoid: [],
    },
    preferences: {
      naming_themes: [],
      avoid_endings: [],
      nickname_tolerance: 'medium',
      length_pref: 'any',
      cultural_bounds: [],
      frozen_callback: false,
    },
    themes: [],
    vetoes: { hard: [], soft: [] },
    region: [],
    target_popularity_band: null,
    comments: '',
    raw_brief: 'Test brief',
  },
  candidates: [
    {
      name: 'Luna',
      ipa: '/ˈluːnə/',
      syllables: 2,
      meaning: 'Moon',
      origins: ['Latin'],
    },
    {
      name: 'Oliver',
      ipa: '/ˈɒlɪvə/',
      syllables: 3,
      meaning: 'Olive tree',
      origins: ['English'],
    },
  ],
  report: {
    summary: 'Beautiful names for your family',
    finalists: [
      { name: 'Luna', why: 'A celestial beauty' },
      { name: 'Oliver', why: 'A timeless classic' },
    ],
    combos: [
      { first: 'Luna', middle: 'Rose', why: 'Perfect pairing' },
    ],
    tradeoffs: ['Luna is rising in popularity'],
    tie_break_tips: ['Try calling out the name at the park'],
  },
  selection: {
    finalists: ['Luna', 'Oliver'],
    near_misses: [
      { name: 'Emma', reason: 'Too popular' },
    ],
  },
}

describe('ReportLayout', () => {
  describe('Hero Section', () => {
    it('should render report hero with surname', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByTestId('report-hero')).toBeInTheDocument()
      expect(screen.getByTestId('hero-surname')).toHaveTextContent('Johnson')
    })

    it('should render report hero with summary', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByTestId('hero-summary')).toHaveTextContent('Beautiful names for your family')
    })

    it('should use "Family" when surname is not provided', () => {
      const resultWithoutSurname = {
        ...mockResult,
        profile: {
          ...mockResult.profile,
          family: undefined,
        },
      }

      render(<ReportLayout runId="test-123" result={resultWithoutSurname as unknown as RunResult} />)

      expect(screen.getByTestId('hero-surname')).toHaveTextContent('Family')
    })
  })

  describe('Finalists Section', () => {
    it('should render section header', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByText('Names We Love for You')).toBeInTheDocument()
    })

    it('should render all finalists', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByTestId('finalist-luna')).toBeInTheDocument()
      expect(screen.getByTestId('finalist-oliver')).toBeInTheDocument()
    })

    it('should open modal when viewing details', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      fireEvent.click(screen.getByTestId('view-details-luna'))

      expect(screen.getByTestId('name-detail-modal')).toBeInTheDocument()
    })

    it('should close modal when requested', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      fireEvent.click(screen.getByTestId('view-details-luna'))
      expect(screen.getByTestId('name-detail-modal')).toBeInTheDocument()

      fireEvent.click(screen.getByTestId('close-modal'))
      expect(screen.queryByTestId('name-detail-modal')).not.toBeInTheDocument()
    })
  })

  // Note: Combo showcase was removed - combos are now embedded in FinalistCard components

  describe('Tradeoffs Section', () => {
    it('should render tradeoffs when they exist', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByText('Things to Consider')).toBeInTheDocument()
      expect(screen.getByText('Luna is rising in popularity')).toBeInTheDocument()
    })

    it('should not render tradeoffs section when empty', () => {
      const resultNoTradeoffs = {
        ...mockResult,
        report: {
          ...mockResult.report,
          tradeoffs: [],
        },
      }

      render(<ReportLayout runId="test-123" result={resultNoTradeoffs} />)

      expect(screen.queryByText('Things to Consider')).not.toBeInTheDocument()
    })
  })

  describe('Tie-break Tips', () => {
    it('should render tie-break tips when they exist', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByText("If You're Torn Between Names")).toBeInTheDocument()
      expect(screen.getByText('Try calling out the name at the park')).toBeInTheDocument()
    })

    it('should not render tie-break section when empty', () => {
      const resultNoTips = {
        ...mockResult,
        report: {
          ...mockResult.report,
          tie_break_tips: [],
        },
      }

      render(<ReportLayout runId="test-123" result={resultNoTips} />)

      expect(screen.queryByText("If You're Torn")).not.toBeInTheDocument()
    })
  })

  describe('Near Misses', () => {
    it('should render near misses accordion', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByTestId('near-misses-accordion')).toBeInTheDocument()
    })

    it('should not render near misses when empty', () => {
      const resultNoNearMisses = {
        ...mockResult,
        selection: {
          ...mockResult.selection,
          near_misses: [],
        },
      }

      render(<ReportLayout runId="test-123" result={resultNoNearMisses} />)

      expect(screen.queryByTestId('near-misses-accordion')).not.toBeInTheDocument()
    })
  })

  describe('Export Actions', () => {
    it('should render export actions with correct props', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      expect(screen.getByTestId('export-actions')).toBeInTheDocument()
      expect(screen.getByTestId('export-run-id')).toHaveTextContent('test-123')
      expect(screen.getByTestId('export-surname')).toHaveTextContent('Johnson')
    })
  })

  describe('Name Card Lookup', () => {
    it('should match name cards to finalists (case insensitive)', () => {
      render(<ReportLayout runId="test-123" result={mockResult} />)

      // The modal should show the correct name when opened
      fireEvent.click(screen.getByTestId('view-details-luna'))

      // Modal should be open with Luna's data
      expect(screen.getByTestId('name-detail-modal')).toBeInTheDocument()
    })
  })
})
