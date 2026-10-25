import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { messaggioErrore, type Persona } from '../api/persone'
import { bottonePrimario } from '../stili'
import { IndiceLettere, idGruppo } from './IndiceLettere'
import { RigaContatto } from './RigaContatto'
import { filtra, raggruppaPerIniziale } from './raggruppa'
import { useContatti } from './useContatti'

type AvvisoNavigazione = { avviso?: string } | null

export function ListaContatti() {
  const { stato, ricarica, elimina } = useContatti()
  const [query, setQuery] = useState('')
  const location = useLocation()
  const [avviso, setAvviso] = useState((location.state as AvvisoNavigazione)?.avviso ?? '')
  const [erroreAzione, setErroreAzione] = useState('')

  const persone = stato.tipo === 'pronto' ? stato.persone : []
  const gruppi = useMemo(() => raggruppaPerIniziale(filtra(persone, query)), [persone, query])
  const lettereAttive = useMemo(() => new Set(gruppi.map((g) => g.lettera)), [gruppi])

  const eliminaPersona = async (persona: Persona) => {
    setErroreAzione('')
    try {
      await elimina(persona.id)
      setAvviso(`Contatto eliminato: ${persona.nome} ${persona.cognome}.`)
    } catch (error) {
      setErroreAzione(messaggioErrore(error))
    }
  }

  return (
    <main>
      <div className="flex flex-wrap items-center justify-between gap-3 py-5">
        <p className="text-tenue">
          {stato.tipo === 'pronto' && `${persone.length} ${persone.length === 1 ? 'contatto' : 'contatti'}`}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="cerca">
            Cerca per nome o telefono
          </label>
          <input
            id="cerca"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca per nome o telefono"
            className="w-64 max-w-full rounded-md border border-linea bg-white px-3 py-2"
          />
          <Link to="/nuovo" className={bottonePrimario}>
            Nuovo contatto
          </Link>
        </div>
      </div>

      <div role="status" className="empty:hidden mb-4 rounded-md bg-inchiostro/5 px-4 py-2">
        {avviso}
      </div>
      {erroreAzione && (
        <p role="alert" className="mb-4 rounded-md bg-pericolo/10 px-4 py-2 text-pericolo">
          {erroreAzione}
        </p>
      )}

      {stato.tipo === 'caricamento' && <p className="text-tenue">Caricamento dei contatti…</p>}

      {stato.tipo === 'errore' && (
        <div role="alert" className="rounded-md border border-pericolo/40 px-4 py-3">
          <p className="text-pericolo">{stato.messaggio}</p>
          <button type="button" onClick={ricarica} className="mt-2 font-semibold underline underline-offset-4">
            Riprova
          </button>
        </div>
      )}

      {stato.tipo === 'pronto' && persone.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-xl font-semibold">La rubrica è vuota.</p>
          <p className="mt-1 text-tenue">Aggiungi il primo contatto per iniziare.</p>
          <Link to="/nuovo" className={`${bottonePrimario} mt-5`}>
            Nuovo contatto
          </Link>
        </div>
      )}

      {stato.tipo === 'pronto' && persone.length > 0 && gruppi.length === 0 && (
        <p className="py-10 text-tenue">Nessun contatto corrisponde a “{query}”.</p>
      )}

      {gruppi.length > 0 && (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:gap-4">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Contatti in rubrica, raggruppati per iniziale del cognome</caption>
            <thead className="sr-only">
              <tr>
                <th scope="col">Cognome e nome</th>
                <th scope="col" className="hidden sm:table-cell">Telefono</th>
                <th scope="col" className="hidden md:table-cell">Indirizzo</th>
                <th scope="col" className="hidden sm:table-cell">Età</th>
                <th scope="col">Azioni</th>
              </tr>
            </thead>
            {gruppi.map(({ lettera, persone: delGruppo }) => (
              <tbody key={lettera} id={idGruppo(lettera)} className="scroll-mt-4">
                <tr>
                  <th scope="rowgroup" colSpan={5} className="pt-6 pb-1 text-left">
                    <span className="inline-block min-w-10 rounded-t-md border-b-2 border-linguetta bg-linguetta/25 px-3 pt-1 text-2xl font-extrabold">
                      {lettera}
                    </span>
                  </th>
                </tr>
                {delGruppo.map((persona) => (
                  <RigaContatto key={persona.id} persona={persona} onElimina={eliminaPersona} />
                ))}
              </tbody>
            ))}
          </table>
          <IndiceLettere lettereAttive={lettereAttive} />
        </div>
      )}
    </main>
  )
}
