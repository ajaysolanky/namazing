import { describe, it, expect, vi, beforeEach } from 'vitest'
import { subscribeToRun } from './sse'

// Mock EventSource
class MockEventSource {
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: Event) => void) | null = null
  url: string
  readyState = 0

  static instances: MockEventSource[] = []

  constructor(url: string) {
    this.url = url
    MockEventSource.instances.push(this)
  }

  close = vi.fn()

  // Helper to simulate messages
  simulateMessage(data: unknown) {
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify(data) } as MessageEvent)
    }
  }

  // Helper to simulate errors
  simulateError(error: Event) {
    if (this.onerror) {
      this.onerror(error)
    }
  }

  static reset() {
    MockEventSource.instances = []
  }
}

// @ts-expect-error - Mocking global EventSource
global.EventSource = MockEventSource

describe('subscribeToRun', () => {
  beforeEach(() => {
    MockEventSource.reset()
    vi.clearAllMocks()
  })

  it('should create EventSource with correct URL', () => {
    const onEvent = vi.fn()
    subscribeToRun('run-123', onEvent)

    expect(MockEventSource.instances.length).toBe(1)
    expect(MockEventSource.instances[0].url).toContain('/api/events/run-123')
  })

  it('should call onEvent when message received', () => {
    const onEvent = vi.fn()
    subscribeToRun('run-123', onEvent)

    const eventSource = MockEventSource.instances[0]
    const mockEvent = {
      type: 'stage_start',
      stage: 'brief-parser',
      timestamp: '2024-01-01T00:00:00Z',
    }

    eventSource.simulateMessage(mockEvent)

    expect(onEvent).toHaveBeenCalledWith(mockEvent)
  })

  it('should handle multiple messages', () => {
    const onEvent = vi.fn()
    subscribeToRun('run-123', onEvent)

    const eventSource = MockEventSource.instances[0]

    eventSource.simulateMessage({ type: 'stage_start', stage: 'brief-parser' })
    eventSource.simulateMessage({ type: 'stage_done', stage: 'brief-parser' })
    eventSource.simulateMessage({ type: 'stage_start', stage: 'name-generator' })

    expect(onEvent).toHaveBeenCalledTimes(3)
  })

  it('should handle JSON parse errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onEvent = vi.fn()
    subscribeToRun('run-123', onEvent)

    const eventSource = MockEventSource.instances[0]

    // Simulate receiving invalid JSON
    if (eventSource.onmessage) {
      eventSource.onmessage({ data: 'invalid json{' } as MessageEvent)
    }

    expect(onEvent).not.toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should close connection on error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onEvent = vi.fn()
    subscribeToRun('run-123', onEvent)

    const eventSource = MockEventSource.instances[0]
    eventSource.simulateError(new Event('error'))

    expect(eventSource.close).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should return cleanup function', () => {
    const onEvent = vi.fn()
    const cleanup = subscribeToRun('run-123', onEvent)

    expect(typeof cleanup).toBe('function')

    cleanup()

    expect(MockEventSource.instances[0].close).toHaveBeenCalled()
  })

  it('should work with different run IDs', () => {
    const onEvent1 = vi.fn()
    const onEvent2 = vi.fn()

    subscribeToRun('run-abc', onEvent1)
    subscribeToRun('run-xyz', onEvent2)

    expect(MockEventSource.instances.length).toBe(2)
    expect(MockEventSource.instances[0].url).toContain('run-abc')
    expect(MockEventSource.instances[1].url).toContain('run-xyz')
  })
})
