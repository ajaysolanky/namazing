import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'

describe('Card', () => {
  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('should render with default variant and padding', () => {
      render(<Card data-testid="card">Default</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-white', 'shadow-soft', 'p-6')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Card variant="default" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('bg-white', 'shadow-soft')
    })

    it('should render elevated variant', () => {
      render(<Card variant="elevated" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('shadow-card', 'hover:shadow-elevated')
    })

    it('should render cream variant', () => {
      render(<Card variant="cream" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('bg-studio-cream')
    })

    it('should render outline variant', () => {
      render(<Card variant="outline" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('border', 'border-studio-ink/10')
    })

    it('should render glass variant', () => {
      render(<Card variant="glass" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('backdrop-blur-lg')
    })

    it('should render premium variant', () => {
      render(<Card variant="premium" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('shadow-card')
    })

    it('should render gradient variant', () => {
      render(<Card variant="gradient" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('bg-gradient-to-br')
    })
  })

  describe('Padding', () => {
    it('should render with no padding', () => {
      render(<Card padding="none" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).not.toHaveClass('p-4', 'p-6', 'p-8', 'p-10')
    })

    it('should render with sm padding', () => {
      render(<Card padding="sm" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('p-4')
    })

    it('should render with md padding', () => {
      render(<Card padding="md" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('p-6')
    })

    it('should render with lg padding', () => {
      render(<Card padding="lg" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('p-8')
    })

    it('should render with xl padding', () => {
      render(<Card padding="xl" data-testid="card">Content</Card>)
      expect(screen.getByTestId('card')).toHaveClass('p-10')
    })
  })

  describe('Custom className', () => {
    it('should merge custom className', () => {
      render(<Card className="custom-card" data-testid="card">Content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-card')
      expect(card).toHaveClass('rounded-2xl')
    })
  })
})

describe('CardHeader', () => {
  it('should render children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('should apply flex column layout', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header')).toHaveClass('flex', 'flex-col')
  })

  it('should merge custom className', () => {
    render(<CardHeader className="custom-header" data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header')).toHaveClass('custom-header')
  })
})

describe('CardTitle', () => {
  it('should render as h3 element', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 3, name: 'Title' })).toBeInTheDocument()
  })

  it('should apply title styles', () => {
    render(<CardTitle data-testid="title">Title</CardTitle>)
    expect(screen.getByTestId('title')).toHaveClass('font-display', 'text-2xl')
  })
})

describe('CardDescription', () => {
  it('should render children', () => {
    render(<CardDescription>Description text</CardDescription>)
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })

  it('should apply description styles', () => {
    render(<CardDescription data-testid="desc">Description</CardDescription>)
    expect(screen.getByTestId('desc')).toHaveClass('text-sm', 'text-studio-ink/60')
  })
})

describe('CardContent', () => {
  it('should render children', () => {
    render(<CardContent>Content area</CardContent>)
    expect(screen.getByText('Content area')).toBeInTheDocument()
  })

  it('should apply padding top', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content')).toHaveClass('pt-4')
  })
})

describe('CardFooter', () => {
  it('should render children', () => {
    render(<CardFooter>Footer content</CardFooter>)
    expect(screen.getByText('Footer content')).toBeInTheDocument()
  })

  it('should apply footer styles', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer')).toHaveClass('flex', 'items-center', 'pt-4')
  })
})

describe('Card Composition', () => {
  it('should render complete card structure', () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>Main content</CardContent>
        <CardFooter>Footer actions</CardFooter>
      </Card>
    )

    expect(screen.getByRole('heading', { name: 'Card Title' })).toBeInTheDocument()
    expect(screen.getByText('Card description')).toBeInTheDocument()
    expect(screen.getByText('Main content')).toBeInTheDocument()
    expect(screen.getByText('Footer actions')).toBeInTheDocument()
  })
})
