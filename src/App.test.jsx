import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the home screen with the learning journey', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Aditzak' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Phase I' })).toBeInTheDocument()
    expect(screen.getByText(/Who and Where/)).toBeInTheDocument()
    expect(screen.getByText(/izan — to be/)).toBeInTheDocument()
    expect(screen.getByText(/egon — to be/)).toBeInTheDocument()
    expect(screen.getAllByText('Coming soon').length).toBeGreaterThan(0)
  })
})
