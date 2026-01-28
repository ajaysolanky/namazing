import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string } & Record<string, unknown>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => {
  // Helper to filter out framer-motion specific props
  const filterMotionProps = (props: Record<string, unknown>) => {
    const {
      initial, animate, exit, transition, variants,
      whileHover, whileTap, whileFocus, whileInView,
      custom, layout, layoutId, drag, dragConstraints,
      onAnimationStart, onAnimationComplete, onUpdate,
      ...rest
    } = props
    return rest
  }

  return {
    motion: {
      div: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <div {...filterMotionProps(props)}>{children}</div>
      ),
      span: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <span {...filterMotionProps(props)}>{children}</span>
      ),
      button: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <button {...filterMotionProps(props)}>{children}</button>
      ),
      p: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <p {...filterMotionProps(props)}>{children}</p>
      ),
      svg: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <svg {...filterMotionProps(props)}>{children}</svg>
      ),
      path: ({ ...props }: Record<string, unknown>) => (
        <path {...filterMotionProps(props)} />
      ),
      ul: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <ul {...filterMotionProps(props)}>{children}</ul>
      ),
      li: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <li {...filterMotionProps(props)}>{children}</li>
      ),
      h1: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <h1 {...filterMotionProps(props)}>{children}</h1>
      ),
      h2: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <h2 {...filterMotionProps(props)}>{children}</h2>
      ),
      h3: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <h3 {...filterMotionProps(props)}>{children}</h3>
      ),
      h4: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <h4 {...filterMotionProps(props)}>{children}</h4>
      ),
      section: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <section {...filterMotionProps(props)}>{children}</section>
      ),
      article: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <article {...filterMotionProps(props)}>{children}</article>
      ),
      a: ({ children, ...props }: { children?: React.ReactNode } & Record<string, unknown>) => (
        <a {...filterMotionProps(props)}>{children}</a>
      ),
    },
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  }
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
