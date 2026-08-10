import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import App from './App'

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('App', () => {
  it('shows backend status and runs a prediction', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (url) =>
        String(url).endsWith('/predict')
          ? jsonResponse({ output: 42 })
          : jsonResponse({ 'app-api': 'version 1.0.0' }),
      )

    render(<App />)

    expect(screen.getByRole('heading', { name: 'React Template', level: 1 })).toBeInTheDocument()
    expect(await screen.findByText('Backend online (version 1.0.0)')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/', undefined)

    await userEvent.click(screen.getByRole('button', { name: 'Predict' }))
    expect(await screen.findByText('Prediction result: 42')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/predict',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ input: 5 }) }),
    )
  })
})
