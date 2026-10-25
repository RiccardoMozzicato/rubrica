import type { Persona } from '../api/persone'

export const persona = (override: Partial<Persona> = {}): Persona => ({
  id: 1,
  nome: 'Mario',
  cognome: 'Rossi',
  indirizzo: 'Via Roma 1',
  telefono: '333 123 4567',
  eta: 40,
  ...override,
})

export const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
