import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError, messaggioErrore, personeApi, type FieldErrors, type Persona, type PersonaInput } from '../api/persone'
import { Campo } from './Campo'
import { bottonePrimario } from '../stili'

type Valori = Record<keyof PersonaInput, string>

const VUOTO: Valori = { nome: '', cognome: '', indirizzo: '', telefono: '', eta: '' }

const daPersona = (p: Persona): Valori => ({
  nome: p.nome,
  cognome: p.cognome,
  indirizzo: p.indirizzo ?? '',
  telefono: p.telefono,
  eta: String(p.eta),
})

/** Converte i valori del form nel payload dell'API; la validazione vera la fa il server. */
const aInput = (v: Valori): PersonaInput => ({
  nome: v.nome.trim(),
  cognome: v.cognome.trim(),
  indirizzo: v.indirizzo.trim() || null,
  telefono: v.telefono.trim(),
  eta: v.eta.trim() === '' ? null : Number(v.eta),
})

type Caricamento = { tipo: 'caricamento' } | { tipo: 'errore'; messaggio: string } | { tipo: 'pronto' }

export function EditorContatto() {
  const { id: idParam } = useParams()
  const id = idParam === undefined ? undefined : Number(idParam)
  const navigate = useNavigate()

  const [valori, setValori] = useState<Valori>(VUOTO)
  const [caricamento, setCaricamento] = useState<Caricamento>({ tipo: id === undefined ? 'pronto' : 'caricamento' })
  const [errori, setErrori] = useState<FieldErrors>({})
  const [erroreGenerale, setErroreGenerale] = useState('')
  const [salvataggio, setSalvataggio] = useState(false)

  useEffect(() => {
    if (id === undefined) return
    let attivo = true
    personeApi
      .trova(id)
      .then((persona) => {
        if (!attivo) return
        setValori(daPersona(persona))
        setCaricamento({ tipo: 'pronto' })
      })
      .catch((error: unknown) => {
        if (attivo) setCaricamento({ tipo: 'errore', messaggio: messaggioErrore(error) })
      })
    return () => {
      attivo = false
    }
  }, [id])

  const aggiorna = (campo: keyof Valori) => (e: { target: { value: string } }) =>
    setValori((correnti) => ({ ...correnti, [campo]: e.target.value }))

  const salva = async (e: FormEvent) => {
    e.preventDefault()
    setSalvataggio(true)
    setErrori({})
    setErroreGenerale('')
    try {
      const payload = aInput(valori)
      const salvata = id === undefined ? await personeApi.crea(payload) : await personeApi.aggiorna(id, payload)
      navigate('/', { state: { avviso: `Contatto salvato: ${salvata.nome} ${salvata.cognome}.` } })
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fieldErrors).length > 0) {
        setErrori(error.fieldErrors)
      }
      setErroreGenerale(messaggioErrore(error))
      setSalvataggio(false)
    }
  }

  if (caricamento.tipo === 'caricamento') {
    return <p className="mt-10 text-tenue">Caricamento del contatto…</p>
  }
  if (caricamento.tipo === 'errore') {
    return (
      <div role="alert" className="mt-10">
        <p className="text-pericolo">{caricamento.messaggio}</p>
        <Link to="/" className="mt-2 inline-block font-semibold underline underline-offset-4">
          Torna alla rubrica
        </Link>
      </div>
    )
  }

  return (
    <main className="max-w-xl">
      <h2 className="pt-8 pb-6 text-2xl font-bold">{id === undefined ? 'Nuovo contatto' : 'Modifica contatto'}</h2>

      {erroreGenerale && (
        <p role="alert" className="mb-5 rounded-md bg-pericolo/10 px-4 py-2 text-pericolo">
          {erroreGenerale}
        </p>
      )}

      <form onSubmit={salva} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo name="nome" etichetta="Nome" value={valori.nome} onChange={aggiorna('nome')} errore={errori.nome} required autoComplete="given-name" />
          <Campo name="cognome" etichetta="Cognome" value={valori.cognome} onChange={aggiorna('cognome')} errore={errori.cognome} required autoComplete="family-name" />
        </div>
        <Campo name="indirizzo" etichetta="Indirizzo" value={valori.indirizzo} onChange={aggiorna('indirizzo')} errore={errori.indirizzo} autoComplete="street-address" />
        <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
          <Campo name="telefono" etichetta="Telefono" type="tel" value={valori.telefono} onChange={aggiorna('telefono')} errore={errori.telefono} required autoComplete="tel" className="tabular-nums" />
          <Campo name="eta" etichetta="Età" type="number" inputMode="numeric" min={0} max={150} value={valori.eta} onChange={aggiorna('eta')} errore={errori.eta} required />
        </div>

        <div className="flex gap-3 border-t border-linea pt-5">
          <button type="submit" disabled={salvataggio} className={`${bottonePrimario} disabled:opacity-60`}>
            {salvataggio ? 'Salvataggio…' : 'Salva'}
          </button>
          <Link to="/" className="rounded-md px-4 py-2 font-semibold text-tenue hover:bg-linea">
            Annulla
          </Link>
        </div>
      </form>
    </main>
  )
}
