export type Persona = {
  id: number
  nome: string
  cognome: string
  indirizzo: string | null
  telefono: string
  eta: number
}

/** Payload di creazione/modifica: l'età può mancare finché il server non la valida. */
export type PersonaInput = Omit<Persona, 'id' | 'eta'> & { eta: number | null }

export type FieldErrors = Partial<Record<keyof PersonaInput, string>>

export class ApiError extends Error {
  readonly status: number
  readonly fieldErrors: FieldErrors

  constructor(status: number, message: string, fieldErrors: FieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

const API_URL = `${__API_URL__}/persone`

const NETWORK_ERROR_MESSAGE = 'Impossibile contattare il server. Controlla che il backend sia avviato.'

type ProblemDetail = { detail?: string; errors?: FieldErrors }

async function readProblem(response: Response): Promise<ProblemDetail> {
  try {
    return (await response.json()) as ProblemDetail
  } catch {
    return {}
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new ApiError(0, NETWORK_ERROR_MESSAGE)
  }

  if (!response.ok) {
    const problem = await readProblem(response)
    throw new ApiError(response.status, problem.detail ?? `Errore del server (${response.status})`, problem.errors)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export const personeApi = {
  elenca: () => request<Persona[]>(''),
  trova: (id: number) => request<Persona>(`/${id}`),
  crea: (persona: PersonaInput) => request<Persona>('', { method: 'POST', body: JSON.stringify(persona) }),
  aggiorna: (id: number, persona: PersonaInput) =>
    request<Persona>(`/${id}`, { method: 'PUT', body: JSON.stringify(persona) }),
  elimina: (id: number) => request<void>(`/${id}`, { method: 'DELETE' }),
}

/** Messaggio leggibile per qualsiasi errore sollevato dalle chiamate API. */
export function messaggioErrore(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Si è verificato un errore inatteso.'
}
