import type { Persona } from '../api/persone'

export const LETTERA_ALTRO = '#'
export const ALFABETO = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', LETTERA_ALTRO]

export type Gruppo = { lettera: string; persone: Persona[] }

const collator = new Intl.Collator('it', { sensitivity: 'base' })

/** Iniziale del cognome senza accenti ("Èrcoli" -> "E"); "#" se non è una lettera. */
export function iniziale(persona: Persona): string {
  const prima = persona.cognome.trim().normalize('NFD').charAt(0).toUpperCase()
  return /^[A-Z]$/.test(prima) ? prima : LETTERA_ALTRO
}

export function confronta(a: Persona, b: Persona): number {
  return collator.compare(a.cognome, b.cognome) || collator.compare(a.nome, b.nome) || a.id - b.id
}

/** Raggruppa per iniziale del cognome, come le linguette di una rubrica cartacea. */
export function raggruppaPerIniziale(persone: readonly Persona[]): Gruppo[] {
  const ordinate = [...persone].sort(confronta)
  return ALFABETO.map((lettera) => ({
    lettera,
    persone: ordinate.filter((persona) => iniziale(persona) === lettera),
  })).filter((gruppo) => gruppo.persone.length > 0)
}

const soloCifre = (testo: string) => testo.replace(/\D/g, '')

/** Cerca su nome, cognome e telefono (il telefono ignora spazi e separatori). */
export function filtra(persone: readonly Persona[], query: string): Persona[] {
  const testo = query.trim().toLocaleLowerCase('it')
  if (testo === '') {
    return [...persone]
  }
  const cifre = soloCifre(testo)
  return persone.filter((persona) => {
    const nomeCompleto = `${persona.nome} ${persona.cognome}`.toLocaleLowerCase('it')
    const cognomeNome = `${persona.cognome} ${persona.nome}`.toLocaleLowerCase('it')
    return (
      nomeCompleto.includes(testo) ||
      cognomeNome.includes(testo) ||
      (cifre.length > 0 && soloCifre(persona.telefono).includes(cifre))
    )
  })
}
