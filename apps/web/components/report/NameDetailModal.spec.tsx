import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NameDetailModal } from './NameDetailModal'
import type { NameCard } from '@/lib/types'

// Mock Radix Dialog
vi.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open }: { children: React.ReactNode; open: boolean }) => (
    open ? <div data-testid="dialog-root">{children}</div> : null
  ),
  Portal: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-portal">{children}</div>,
  Overlay: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-overlay" {...props}>{children}</div>
  ),
  Content: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <div data-testid="dialog-content" role="dialog" {...props}>{children}</div>
  ),
  Title: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <h2 data-testid="dialog-title" {...props}>{children}</h2>
  ),
  Description: ({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) => (
    <p data-testid="dialog-description" {...props}>{children}</p>
  ),
  Close: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
    <button data-testid="dialog-close" {...props}>{children}</button>
  ),
  Trigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockNameCard: NameCard = {
  name: 'Luna',
  ipa: '/ˈluːnə/',
  syllables: 2,
  meaning: 'Moon goddess',
  origins: ['Latin', 'Italian'],
  nicknames: {
    intended: ['Lu', 'Lulu'],
    likely: ['Luni'],
    avoid: ['Loony'],
  },
  surname_fit: {
    surname: 'Johnson',
    notes: 'Flows beautifully together',
  },
  sibset_fit: {
    siblings: ['Oliver', 'Emma'],
    notes: 'Creates a cohesive sibling set',
  },
  popularity: {
    latest_rank: 14,
    trend_notes: 'Rising in popularity',
  },
  notable_bearers: {
    positive: ['Luna Lovegood'],
    fictional: ['Luna from Harry Potter'],
  },
  cultural_notes: ['Associated with the moon in Roman mythology'],
  combo_suggestions: [
    { first: 'Luna', middle: 'Rose', why: 'Beautiful pairing' },
  ],
}

describe('NameDetailModal', () => {
  const defaultProps = {
    nameCard: mockNameCard,
    open: true,
    onOpenChange: vi.fn(),
  }

  describe('Rendering', () => {
    it('should render the name as title', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Luna')).toBeInTheDocument()
    })

    it('should render IPA pronunciation', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('/ˈluːnə/')).toBeInTheDocument()
    })

    it('should render meaning', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Moon goddess')).toBeInTheDocument()
    })

    it('should render origins', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Latin, Italian')).toBeInTheDocument()
    })

    it('should render syllable count', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('2')).toBeInTheDocument()
    })
  })

  describe('Null State', () => {
    it('should return null when nameCard is null', () => {
      const { container } = render(
        <NameDetailModal nameCard={null} open={true} onOpenChange={vi.fn()} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should return null when dialog is closed', () => {
      const { container } = render(
        <NameDetailModal {...defaultProps} open={false} />
      )
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Nicknames', () => {
    it('should render intended nicknames', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Lu')).toBeInTheDocument()
      expect(screen.getByText('Lulu')).toBeInTheDocument()
    })

    it('should render likely nicknames', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Luni')).toBeInTheDocument()
    })

    it('should render nicknames to avoid', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText(/Loony/)).toBeInTheDocument()
    })
  })

  describe('Surname Fit', () => {
    it('should render surname fit section', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText(/With Johnson/)).toBeInTheDocument()
      expect(screen.getByText('Flows beautifully together')).toBeInTheDocument()
    })
  })

  describe('Sibling Fit', () => {
    it('should render sibling harmony section', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Sibling harmony')).toBeInTheDocument()
      expect(screen.getByText('Creates a cohesive sibling set')).toBeInTheDocument()
    })
  })

  describe('Deep Dive Toggle', () => {
    it('should show toggle button for deep dive content', () => {
      render(<NameDetailModal {...defaultProps} />)
      expect(screen.getByText('Show more details')).toBeInTheDocument()
    })

    it('should show popularity when deep dive expanded', () => {
      render(<NameDetailModal {...defaultProps} />)

      fireEvent.click(screen.getByText('Show more details'))

      expect(screen.getByText('Popularity')).toBeInTheDocument()
      expect(screen.getByText('#14')).toBeInTheDocument()
    })

    it('should toggle button text when expanded', () => {
      render(<NameDetailModal {...defaultProps} />)

      fireEvent.click(screen.getByText('Show more details'))

      expect(screen.getByText('Hide details')).toBeInTheDocument()
    })
  })

  describe('Without Optional Fields', () => {
    it('should render without nicknames', () => {
      const nameCard = { ...mockNameCard, nicknames: undefined }
      const { container } = render(
        <NameDetailModal nameCard={nameCard} open={true} onOpenChange={vi.fn()} />
      )
      expect(container).toBeInTheDocument()
      expect(screen.queryByText('Nicknames')).not.toBeInTheDocument()
    })

    it('should render without surname fit', () => {
      const nameCard = { ...mockNameCard, surname_fit: undefined }
      render(<NameDetailModal nameCard={nameCard} open={true} onOpenChange={vi.fn()} />)
      expect(screen.queryByText(/With Johnson/)).not.toBeInTheDocument()
    })

    it('should render without sibset fit', () => {
      const nameCard = { ...mockNameCard, sibset_fit: undefined }
      render(<NameDetailModal nameCard={nameCard} open={true} onOpenChange={vi.fn()} />)
      expect(screen.queryByText('Sibling harmony')).not.toBeInTheDocument()
    })
  })
})
