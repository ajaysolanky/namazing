import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Header } from './Header'
import { useAuth } from '@/hooks/useAuth'

const mockPush = vi.fn()
const mockRefresh = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

// Override global useAuth mock with a spy so we can call mockReturnValue
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}))

const mockSignOut = vi.fn().mockResolvedValue(undefined)

function mockAuthenticated() {
  vi.mocked(useAuth).mockReturnValue({
    user: {
      id: '1',
      email: 'test@example.com',
      user_metadata: { display_name: 'Test User' },
    } as any,
    loading: false,
    signOut: mockSignOut,
  })
}

function mockUnauthenticated() {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    loading: false,
    signOut: mockSignOut,
  })
}

function mockLoading() {
  vi.mocked(useAuth).mockReturnValue({
    user: null,
    loading: true,
    signOut: mockSignOut,
  })
}

describe('Header', () => {
  beforeEach(() => {
    mockUnauthenticated()
    mockPush.mockClear()
    mockRefresh.mockClear()
    mockSignOut.mockClear()
  })

  describe('Rendering', () => {
    it('should render the header element', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('should render the namazing logo/brand', () => {
      render(<Header />)
      expect(screen.getByText('namazing')).toBeInTheDocument()
    })

    it('should render navigation', () => {
      render(<Header />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('should render home link on logo', () => {
      render(<Header />)
      const homeLink = screen.getByRole('link', { name: 'namazing' })
      expect(homeLink).toHaveAttribute('href', '/')
    })

    it('should render nav links for unauthenticated users', () => {
      render(<Header />)
      expect(screen.getByText('How it Works')).toBeInTheDocument()
      expect(screen.getByText('Pricing')).toBeInTheDocument()
      expect(screen.getByText('FAQ')).toBeInTheDocument()
    })

    it('should render sign in and get started buttons when logged out', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Get started' })).toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should be sticky positioned', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toHaveClass('sticky', 'top-0')
    })

    it('should have backdrop blur', () => {
      render(<Header />)
      expect(screen.getByRole('banner')).toHaveClass('backdrop-blur-md')
    })
  })

  describe('Authenticated state', () => {
    beforeEach(() => {
      mockAuthenticated()
    })

    it('should render Dashboard link when authenticated', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()
    })

    it('should render avatar button with user initial', () => {
      render(<Header />)
      const avatarButton = screen.getByRole('button', { name: 'T' })
      expect(avatarButton).toBeInTheDocument()
    })

    it('should use email initial when display_name is missing', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: {
          id: '2',
          email: 'jane@example.com',
          user_metadata: {},
        } as any,
        loading: false,
        signOut: mockSignOut,
      })
      render(<Header />)
      expect(screen.getByRole('button', { name: 'J' })).toBeInTheDocument()
    })

    it('should open dropdown with user info when avatar is clicked', () => {
      render(<Header />)
      const avatarButton = screen.getByRole('button', { name: 'T' })
      fireEvent.click(avatarButton)

      expect(screen.getByText('Test User')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })

    it('should show Dashboard link in dropdown', () => {
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'T' }))

      const dashboardLinks = screen.getAllByText('Dashboard')
      expect(dashboardLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('should show Sign out button in dropdown', () => {
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'T' }))

      expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    })

    it('should call signOut when Sign out is clicked', async () => {
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'T' }))
      fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))

      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('should NOT show Sign in or Get started buttons when authenticated', () => {
      render(<Header />)
      expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Get started' })).not.toBeInTheDocument()
    })

    it('should display email when display_name is missing in dropdown', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: {
          id: '2',
          email: 'jane@example.com',
          user_metadata: {},
        } as any,
        loading: false,
        signOut: mockSignOut,
      })
      render(<Header />)
      fireEvent.click(screen.getByRole('button', { name: 'J' }))

      // When no display_name, the primary text shows the email
      const emailElements = screen.getAllByText('jane@example.com')
      expect(emailElements.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('Mobile menu', () => {
    it('should have a toggle menu button with correct aria-label', () => {
      render(<Header />)
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument()
    })

    it('should open mobile menu when toggle is clicked', () => {
      render(<Header />)
      fireEvent.click(screen.getByLabelText('Toggle menu'))

      // Mobile menu renders nav links as block-level links
      const howItWorksLinks = screen.getAllByText('How it Works')
      expect(howItWorksLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('should close mobile menu when a nav link is clicked', () => {
      render(<Header />)
      fireEvent.click(screen.getByLabelText('Toggle menu'))

      // Get the mobile menu nav links (they have onClick to close)
      const howItWorksLinks = screen.getAllByText('How it Works')
      // Click the last one (mobile version)
      fireEvent.click(howItWorksLinks[howItWorksLinks.length - 1])

      // After clicking, the mobile duplicates should be gone
      const remaining = screen.getAllByText('How it Works')
      expect(remaining.length).toBe(1)
    })

    it('should show Sign in and Get started in mobile menu for unauthenticated users', () => {
      render(<Header />)
      fireEvent.click(screen.getByLabelText('Toggle menu'))

      const signInLinks = screen.getAllByText('Sign in')
      expect(signInLinks.length).toBeGreaterThanOrEqual(2)

      const getStartedLinks = screen.getAllByText('Get started')
      expect(getStartedLinks.length).toBeGreaterThanOrEqual(2)
    })

    it('should show Dashboard and Sign out in mobile menu for authenticated users', () => {
      mockAuthenticated()
      render(<Header />)
      fireEvent.click(screen.getByLabelText('Toggle menu'))

      const dashboardLinks = screen.getAllByText('Dashboard')
      expect(dashboardLinks.length).toBeGreaterThanOrEqual(2)

      // Sign out button appears in mobile menu
      expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument()
    })

    it('should call signOut when Sign out is clicked in mobile menu (authenticated)', () => {
      mockAuthenticated()
      render(<Header />)
      fireEvent.click(screen.getByLabelText('Toggle menu'))

      fireEvent.click(screen.getByRole('button', { name: 'Sign out' }))
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('should close mobile menu when toggle is clicked again', () => {
      render(<Header />)
      const toggle = screen.getByLabelText('Toggle menu')

      fireEvent.click(toggle)
      expect(screen.getAllByText('How it Works').length).toBeGreaterThanOrEqual(2)

      fireEvent.click(toggle)
      expect(screen.getAllByText('How it Works').length).toBe(1)
    })
  })

  describe('Loading state', () => {
    beforeEach(() => {
      mockLoading()
    })

    it('should not show Sign in or Get started while loading', () => {
      render(<Header />)
      expect(screen.queryByRole('link', { name: 'Sign in' })).not.toBeInTheDocument()
      expect(screen.queryByRole('link', { name: 'Get started' })).not.toBeInTheDocument()
    })

    it('should not show Dashboard while loading', () => {
      render(<Header />)
      expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument()
    })

    it('should not show avatar button while loading', () => {
      render(<Header />)
      expect(screen.queryByRole('button', { name: 'T' })).not.toBeInTheDocument()
    })

    it('should still render nav links while loading', () => {
      render(<Header />)
      expect(screen.getByText('How it Works')).toBeInTheDocument()
      expect(screen.getByText('Pricing')).toBeInTheDocument()
      expect(screen.getByText('FAQ')).toBeInTheDocument()
    })
  })
})
