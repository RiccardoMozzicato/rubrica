import { describe, expect, it } from 'vitest'
import { persona } from '../test/fixtures'
import { filtra, iniziale, raggruppaPerIniziale } from './raggruppa'

describe('iniziale', () => {
  it('usa la prima lettera del cognome senza accenti', () => {
    expect(iniziale(persona({ cognome: 'Èrcoli' }))).toBe('E')
  })

  it('restituisce # se il cognome non inizia con una lettera', () => {
    expect(iniziale(persona({ cognome: "'t Hooft" }))).toBe('#')
  })
})

describe('raggruppaPerIniziale', () => {
  it('raggruppa per iniziale e ordina per cognome e nome', () => {
    const lista = [
      persona({ id: 1, nome: 'Paolo', cognome: 'Rossi' }),
      persona({ id: 2, nome: 'Anna', cognome: 'bianchi' }),
      persona({ id: 3, nome: 'Luca', cognome: 'Rossi' }),
    ]

    const gruppi = raggruppaPerIniziale(lista)

    expect(gruppi.map((g) => g.lettera)).toEqual(['B', 'R'])
    expect(gruppi[1].persone.map((p) => p.nome)).toEqual(['Luca', 'Paolo'])
  })

  it('non modifica la lista originale', () => {
    const lista = [persona({ id: 1, cognome: 'Zeta' }), persona({ id: 2, cognome: 'Alfa' })]

    raggruppaPerIniziale(lista)

    expect(lista.map((p) => p.cognome)).toEqual(['Zeta', 'Alfa'])
  })
})

describe('filtra', () => {
  const lista = [persona({ id: 1 }), persona({ id: 2, nome: 'Anna', cognome: 'Verdi', telefono: '+39 02 555 0101' })]

  it('trova per nome e cognome in qualsiasi ordine', () => {
    expect(filtra(lista, 'rossi mario')).toHaveLength(1)
    expect(filtra(lista, 'Anna Verdi')[0].id).toBe(2)
  })

  it('trova per telefono ignorando spazi', () => {
    expect(filtra(lista, '5550101')[0].id).toBe(2)
  })

  it('con query vuota restituisce tutti', () => {
    expect(filtra(lista, '  ')).toHaveLength(2)
  })
})
