import { useState } from 'react'
import { Link } from 'react-router'
import type { Persona } from '../api/persone'

type Props = {
  persona: Persona
  onElimina: (persona: Persona) => Promise<void>
}

const azione = 'rounded px-2.5 py-1 text-sm font-semibold'

export function RigaContatto({ persona, onElimina }: Props) {
  const [inConferma, setInConferma] = useState(false)
  const [inCorso, setInCorso] = useState(false)
  const nomeCompleto = `${persona.nome} ${persona.cognome}`
  const linkTelefono = `tel:${persona.telefono.replace(/\s/g, '')}`

  const conferma = async () => {
    setInCorso(true)
    try {
      await onElimina(persona)
    } finally {
      setInCorso(false)
      setInConferma(false)
    }
  }

  return (
    <tr className="border-b border-linea last:border-b-0">
      <td className="py-3 pr-4">
        <span className="font-bold">{persona.cognome}</span> {persona.nome}
        {/* Su schermi stretti il telefono sta sotto il nome invece che in colonna */}
        <a href={linkTelefono} className="block text-tenue tabular-nums sm:hidden">
          {persona.telefono}
        </a>
      </td>
      <td className="hidden py-3 pr-4 whitespace-nowrap tabular-nums sm:table-cell">
        <a href={linkTelefono} className="hover:underline">
          {persona.telefono}
        </a>
      </td>
      <td className="hidden py-3 pr-4 text-tenue md:table-cell">{persona.indirizzo}</td>
      <td className="hidden py-3 pr-4 text-tenue tabular-nums sm:table-cell">{persona.eta} anni</td>
      <td className="py-2">
        <div className="flex flex-wrap justify-end gap-1">
          {inConferma ? (
            <>
              <button
                type="button"
                onClick={conferma}
                disabled={inCorso}
                aria-label={`Conferma eliminazione di ${nomeCompleto}`}
                className={`${azione} bg-pericolo text-white disabled:opacity-60`}
              >
                {inCorso ? 'Elimino…' : 'Conferma'}
              </button>
              <button type="button" onClick={() => setInConferma(false)} className={`${azione} text-tenue`}>
                Annulla
              </button>
            </>
          ) : (
            <>
              <Link to={`/modifica/${persona.id}`} aria-label={`Modifica ${nomeCompleto}`} className={`${azione} hover:bg-linea`}>
                Modifica
              </Link>
              <button
                type="button"
                onClick={() => setInConferma(true)}
                aria-label={`Elimina ${nomeCompleto}`}
                className={`${azione} text-pericolo hover:bg-pericolo/10`}
              >
                Elimina
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
