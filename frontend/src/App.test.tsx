import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the home page and shows backend status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    render(<App />)

    expect(screen.getByRole('heading', { name: 'React Template', level: 1 })).toBeInTheDocument()
    expect(await screen.findByText('Backend online')).toBeInTheDocument()
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/health', undefined)
  })
})
