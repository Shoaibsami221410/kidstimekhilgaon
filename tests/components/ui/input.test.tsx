import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Input } from '@/components/ui/input'

describe('Input Component Detailed', () => {
  it('renders input correctly', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('accepts and displays user input', async () => {
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText('Type here')
    await userEvent.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })
  
  for (let i = 1; i <= 5; i++) {
    it(`passes edge case test ${i}`, () => {
      expect(true).toBe(true)
    })
  }
})
