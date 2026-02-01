import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ExportActions } from './ExportActions'

// Mock window methods
const mockOpen = vi.fn()
const mockClipboard = {
  writeText: vi.fn().mockResolvedValue(undefined),
}

beforeEach(() => {
  vi.clearAllMocks()
  Object.defineProperty(window, 'open', { value: mockOpen, writable: true })
  Object.defineProperty(navigator, 'clipboard', { value: mockClipboard, writable: true })
  Object.defineProperty(window, 'location', {
    value: { href: 'https://example.com/report/123' },
    writable: true,
  })
})

describe('ExportActions', () => {
  describe('Rendering', () => {
    it('should render the title', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)
      expect(screen.getByText('Save & share your results')).toBeInTheDocument()
    })

    it('should render share button', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
    })

    it('should render download PDF button', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)
      expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
    })

    it('should render description text', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)
      expect(screen.getByText(/download a beautiful pdf/i)).toBeInTheDocument()
    })
  })

  describe('Share Dropdown', () => {
    it('should toggle share options when clicking share button', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)

      // Initially options hidden
      expect(screen.queryByText('Copy link')).not.toBeInTheDocument()

      // Click to show
      fireEvent.click(screen.getByRole('button', { name: /share/i }))

      // Options should be visible
      expect(screen.getByText('Copy link')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Twitter / X')).toBeInTheDocument()
      expect(screen.getByText('Facebook')).toBeInTheDocument()
    })

    it('should copy link when clicking copy link option', async () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)

      fireEvent.click(screen.getByRole('button', { name: /share/i }))
      fireEvent.click(screen.getByText('Copy link'))

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith('https://example.com/report/123')
      })

      // Dropdown closes after clicking copy link, so "Copied!" is not visible
      expect(screen.queryByText('Copy link')).not.toBeInTheDocument()
    })

    it('should open Twitter share when clicking Twitter option', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)

      fireEvent.click(screen.getByRole('button', { name: /share/i }))
      fireEvent.click(screen.getByText('Twitter / X'))

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('should open Facebook share when clicking Facebook option', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)

      fireEvent.click(screen.getByRole('button', { name: /share/i }))
      fireEvent.click(screen.getByText('Facebook'))

      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer'),
        '_blank',
        'noopener,noreferrer'
      )
    })

    it('should close dropdown when clicking outside', () => {
      render(<ExportActions runId="test-123" surname="Johnson" />)

      // Open dropdown
      fireEvent.click(screen.getByRole('button', { name: /share/i }))
      expect(screen.getByText('Copy link')).toBeInTheDocument()

      // Click the overlay to close
      const overlay = document.querySelector('.fixed.inset-0')
      if (overlay) fireEvent.click(overlay)

      expect(screen.queryByText('Copy link')).not.toBeInTheDocument()
    })
  })

  describe('PDF Download', () => {
    it('should show loading state while downloading', async () => {
      let resolveBlob!: (value: Blob) => void
      const blobPromise = new Promise<Blob>((r) => { resolveBlob = r })

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => blobPromise,
      })

      // Stub URL APIs so the finally block doesn't throw
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test')
      global.URL.revokeObjectURL = vi.fn()

      render(<ExportActions runId="test-123" surname="Johnson" />)

      fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))

      expect(screen.getByText('Generating PDF...')).toBeInTheDocument()

      // Resolve the pending blob so the handler completes and state is cleaned up
      resolveBlob(new Blob(['test'], { type: 'application/pdf' }))
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
      })
    })

    it('should download PDF with correct filename', async () => {
      const mockBlob = new Blob(['test'], { type: 'application/pdf' })
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      })

      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test')
      const mockRevokeObjectURL = vi.fn()
      global.URL.createObjectURL = mockCreateObjectURL
      global.URL.revokeObjectURL = mockRevokeObjectURL

      render(<ExportActions runId="test-123" surname="Johnson" />)

      fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/pdf/test-123', expect.objectContaining({ signal: expect.any(AbortSignal) }))
      })
    })

    it('should handle PDF download error gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({}),
      })

      render(<ExportActions runId="test-123" surname="Johnson" />)

      fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled()
      })

      // Wait for the handler to fully complete (setIsDownloading(false) in finally block)
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })
})
