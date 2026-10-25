import { useCallback, useEffect, useState } from 'react'
import { messaggioErrore, personeApi, type Persona } from '../api/persone'

type Stato =
  | { tipo: 'caricamento' }
  | { tipo: 'errore'; messaggio: string }
  | { tipo: 'pronto'; persone: Persona[] }

export function useContatti() {
  const [stato, setStato] = useState<Stato>({ tipo: 'caricamento' })

  const carica = useCallback(async () => {
    setStato({ tipo: 'caricamento' })
    try {
      setStato({ tipo: 'pronto', persone: await personeApi.elenca() })
    } catch (error) {
      setStato({ tipo: 'errore', messaggio: messaggioErrore(error) })
    }
  }, [])

  useEffect(() => {
    void carica()
  }, [carica])

  /** Elimina sul server e poi dallo stato locale; rilancia l'errore al chiamante. */
  const elimina = useCallback(async (id: number) => {
    await personeApi.elimina(id)
    setStato((corrente) =>
      corrente.tipo === 'pronto'
        ? { tipo: 'pronto', persone: corrente.persone.filter((persona) => persona.id !== id) }
        : corrente,
    )
  }, [])

  return { stato, ricarica: carica, elimina }
}
