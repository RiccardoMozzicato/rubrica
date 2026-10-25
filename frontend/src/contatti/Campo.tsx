import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  name: string
  etichetta: string
  errore?: string
}

export function Campo({ name, etichetta, errore, className = '', ...input }: Props) {
  const idErrore = `${name}-errore`
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-semibold">
        {etichetta}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={errore ? true : undefined}
        aria-describedby={errore ? idErrore : undefined}
        className={`rounded-md border bg-white px-3 py-2 ${errore ? 'border-pericolo' : 'border-linea'} ${className}`}
        {...input}
      />
      {errore && (
        <p id={idErrore} className="text-sm text-pericolo">
          {errore}
        </p>
      )}
    </div>
  )
}
