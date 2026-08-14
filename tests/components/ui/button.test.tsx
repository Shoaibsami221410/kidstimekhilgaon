import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '@/components/ui/button'

describe('Button Component Detailed', () => {
  it('renders default button correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('triggers onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
  
  const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
  variants.forEach((variant) => {
    it(`renders with variant ${variant} without error`, () => {
      render(<Button variant={variant}>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  const sizes = ['default', 'sm', 'lg', 'icon'] as const;
  sizes.forEach((size) => {
    it(`renders with size ${size} without error`, () => {
      render(<Button size={size}>Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
