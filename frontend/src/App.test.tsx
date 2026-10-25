import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { personeApi } from './api/persone'

vi.mock('./api/persone', async (importOriginal) => {
  const originale = await importOriginal<typeof import('./api/persone')>()
  return { ...originale, personeApi: { elenca: vi.fn() } }
})

describe('App', () => {
  it('collega la versione JSP della lista', () => {
    vi.mocked(personeApi.elenca).mockResolvedValue([])

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Versione JSP' })).toHaveAttribute('href', '/Rubrica/lista')
  })
})
