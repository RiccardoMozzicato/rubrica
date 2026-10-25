import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, personeApi } from '../api/persone'
import { persona } from '../test/fixtures'
import { EditorContatto } from './EditorContatto'

vi.mock('../api/persone', async (importOriginal) => {
  const originale = await importOriginal<typeof import('../api/persone')>()
  return { ...originale, personeApi: { trova: vi.fn(), crea: vi.fn(), aggiorna: vi.fn() } }
})

const api = vi.mocked(personeApi)

const renderEditor = (percorso: string) =>
  render(
    <MemoryRouter initialEntries={[percorso]}>
      <Routes>
        <Route path="/" element={<p>Pagina lista</p>} />
        <Route path="/nuovo" element={<EditorContatto />} />
        <Route path="/modifica/:id" element={<EditorContatto />} />
      </Routes>
    </MemoryRouter>,
  )

describe('EditorContatto', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('crea un nuovo contatto e torna alla lista', async () => {
    api.crea.mockResolvedValue(persona())
    renderEditor('/nuovo')

    await userEvent.type(screen.getByLabelText('Nome'), 'Mario')
    await userEvent.type(screen.getByLabelText('Cognome'), 'Rossi')
    await userEvent.type(screen.getByLabelText('Telefono'), '333 123 4567')
    await userEvent.type(screen.getByLabelText('Età'), '40')
    await userEvent.click(screen.getByRole('button', { name: 'Salva' }))

    expect(api.crea).toHaveBeenCalledWith({
      nome: 'Mario',
      cognome: 'Rossi',
      indirizzo: null,
      telefono: '333 123 4567',
      eta: 40,
    })
    expect(await screen.findByText('Pagina lista')).toBeInTheDocument()
  })

  it('in modifica precompila il form con i dati del contatto', async () => {
    api.trova.mockResolvedValue(persona({ id: 7 }))

    renderEditor('/modifica/7')

    expect(await screen.findByLabelText('Nome')).toHaveValue('Mario')
    expect(screen.getByLabelText('Indirizzo')).toHaveValue('Via Roma 1')
    expect(screen.getByLabelText('Età')).toHaveValue(40)
    expect(api.trova).toHaveBeenCalledWith(7)
  })

  it('mostra gli errori di validazione del server accanto ai campi', async () => {
    api.crea.mockRejectedValue(
      new ApiError(400, 'Controlla i campi evidenziati', { telefono: 'Usa solo cifre, spazi e i simboli + ( ) -' }),
    )
    renderEditor('/nuovo')

    await userEvent.click(screen.getByRole('button', { name: 'Salva' }))

    const telefono = screen.getByLabelText('Telefono')
    expect(telefono).toHaveAttribute('aria-invalid', 'true')
    expect(telefono).toHaveAccessibleDescription('Usa solo cifre, spazi e i simboli + ( ) -')
    expect(screen.getByRole('alert')).toHaveTextContent('Controlla i campi evidenziati')
  })

  it('mostra un messaggio se il contatto da modificare non esiste', async () => {
    api.trova.mockRejectedValue(new ApiError(404, 'Persona con id 99 non trovata'))

    renderEditor('/modifica/99')

    expect(await screen.findByRole('alert')).toHaveTextContent('Persona con id 99 non trovata')
  })

  it('Annulla torna alla lista senza salvare', async () => {
    renderEditor('/nuovo')

    await userEvent.click(screen.getByRole('link', { name: 'Annulla' }))

    expect(screen.getByText('Pagina lista')).toBeInTheDocument()
    expect(api.crea).not.toHaveBeenCalled()
  })
})
