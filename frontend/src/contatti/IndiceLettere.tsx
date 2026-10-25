import { ALFABETO } from './raggruppa'

type Props = { lettereAttive: ReadonlySet<string> }

export const idGruppo = (lettera: string) => `lettera-${lettera === '#' ? 'altro' : lettera}`

/** Linguette A–Z sul bordo destro: le lettere senza contatti restano visibili ma spente. */
export function IndiceLettere({ lettereAttive }: Props) {
  return (
    <nav aria-label="Indice alfabetico" className="sticky top-4">
      <ol className="flex flex-col text-xs font-bold sm:text-sm">
        {ALFABETO.map((lettera) => (
          <li key={lettera}>
            {lettereAttive.has(lettera) ? (
              <a
                href={`#${idGruppo(lettera)}`}
                className="block rounded-r-md bg-linguetta py-px pr-2 pl-1.5 shadow-[inset_0_-1px_0_rgb(0_0_0/0.12)] text-inchiostro hover:pl-2.5 motion-safe:transition-[padding]"
              >
                {lettera}
              </a>
            ) : (
              <span aria-hidden="true" className="block py-px pr-2 pl-1.5 text-tenue/35">
                {lettera}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
