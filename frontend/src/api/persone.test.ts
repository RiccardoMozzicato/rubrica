import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, persona } from '../test/fixtures'
import { ApiError, personeApi } from './persone'

const fetchMock = vi.fn<typeof fetch>()
vi.stubGlobal('fetch', fetchMock)

afterEach(() => {
  fetchMock.mockReset()
})

describe('personeApi', () => {
  it('elenca chiama GET /Rubrica/api/persone', async () => {
    fetchMock.mockResolvedValue(jsonResponse([persona()]))

    const persone = await personeApi.elenca()

    expect(persone).toHaveLength(1)
    expect(fetchMock.mock.calls[0][0]).toBe('/Rubrica/api/persone')
  })

  it('crea invia il JSON con POST', async () => {
    fetchMock.mockResolvedValue(jsonResponse(persona(), 201))
    const { id: _id, ...input } = persona()

    await personeApi.crea(input)

    const [, init] = fetchMock.mock.calls[0]
    expect(init?.method).toBe('POST')
    expect(JSON.parse(String(init?.body))).toEqual(input)
  })

  it('elimina gestisce la risposta 204 senza corpo', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    await expect(personeApi.elimina(1)).resolves.toBeUndefined()
  })

  it('trasforma un ProblemDetail 400 in ApiError con errori per campo', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: 'Controlla i campi evidenziati', errors: { nome: 'obbligatorio' } }, 400),
    )

    const errore = await personeApi.crea({ ...persona(), nome: '' }).catch((e: unknown) => e)

    expect(errore).toBeInstanceOf(ApiError)
    expect((errore as ApiError).status).toBe(400)
    expect((errore as ApiError).fieldErrors).toEqual({ nome: 'obbligatorio' })
  })

  it('segnala un errore di rete con un messaggio comprensibile', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'))

    await expect(personeApi.elenca()).rejects.toThrow(/Impossibile contattare il server/)
  })
})
