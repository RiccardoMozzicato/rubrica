import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, personeApi } from '../api/persone'
import { persona } from '../test/fixtures'
import { ListaContatti } from './ListaContatti'

vi.mock('../api/persone', async (importOriginal) => {
  const originale = await importOriginal<typeof import('../api/persone')>()
  return { ...originale, personeApi: { elenca: vi.fn(), elimina: vi.fn() } }
})

const api = vi.mocked(personeApi)

const renderLista = () =>
  render(
    <MemoryRouter>
      <ListaContatti />
    </MemoryRouter>,
  )

describe('ListaContatti', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('mostra i contatti raggruppati per iniziale con indice attivo solo sulle lettere presenti', async () => {
    api.elenca.mockResolvedValue([persona(), persona({ id: 2, nome: 'Anna', cognome: 'Bianchi' })])

    renderLista()

    expect(await screen.findByText('Rossi')).toBeInTheDocument()
    expect(screen.getByText('2 contatti')).toBeInTheDocument()
    const indice = screen.getByRole('navigation', { name: 'Indice alfabetico' })
    expect(within(indice).getByRole('link', { name: 'B' })).toHaveAttribute('href', '#lettera-B')
    expect(within(indice).queryByRole('link', { name: 'C' })).not.toBeInTheDocument()
  })

  it('mostra lo stato vuoto con invito a creare un contatto', async () => {
    api.elenca.mockResolvedValue([])

    renderLista()

    expect(await screen.findByText('La rubrica è vuota.')).toBeInTheDocument()
  })

  it('mostra l’errore di caricamento e permette di riprovare', async () => {
    api.elenca.mockRejectedValueOnce(new ApiError(0, 'Impossibile contattare il server.'))
    api.elenca.mockResolvedValueOnce([persona()])

    renderLista()
    await userEvent.click(await screen.findByRole('button', { name: 'Riprova' }))

    expect(await screen.findByText('Rossi')).toBeInTheDocument()
  })

  it('filtra con la ricerca', async () => {
    api.elenca.mockResolvedValue([persona(), persona({ id: 2, nome: 'Anna', cognome: 'Bianchi' })])
    renderLista()
    await screen.findByText('Rossi')

    await userEvent.type(screen.getByRole('searchbox'), 'anna')

    expect(screen.queryByText('Rossi')).not.toBeInTheDocument()
    expect(screen.getByText('Bianchi')).toBeInTheDocument()
  })

  it('elimina dopo conferma e rimuove la riga', async () => {
    api.elenca.mockResolvedValue([persona()])
    api.elimina.mockResolvedValue(undefined)
    renderLista()

    await userEvent.click(await screen.findByRole('button', { name: 'Elimina Mario Rossi' }))
    expect(api.elimina).not.toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'Conferma eliminazione di Mario Rossi' }))

    expect(api.elimina).toHaveBeenCalledWith(1)
    expect(await screen.findByRole('status')).toHaveTextContent('Contatto eliminato: Mario Rossi.')
    expect(screen.queryByText('Rossi')).not.toBeInTheDocument()
  })
})
