import { Link, Route, Routes } from 'react-router'
import { EditorContatto } from './contatti/EditorContatto'
import { ListaContatti } from './contatti/ListaContatti'

export function App() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-8">
      <header className="flex items-end justify-between gap-4 border-b-2 border-inchiostro pt-8 pb-3 sm:pt-12">
        <Link to="/" className="rounded-sm">
          <h1 className="text-5xl leading-none font-extrabold tracking-tight sm:text-7xl">Rubrica</h1>
        </Link>
      </header>

      <Routes>
        <Route index element={<ListaContatti />} />
        <Route path="nuovo" element={<EditorContatto />} />
        <Route path="modifica/:id" element={<EditorContatto />} />
        <Route path="*" element={<PaginaNonTrovata />} />
      </Routes>
    </div>
  )
}

function PaginaNonTrovata() {
  return (
    <p className="mt-10 text-tenue">
      Questa pagina non esiste.{' '}
      <Link to="/" className="font-semibold text-inchiostro underline underline-offset-4">
        Torna alla rubrica
      </Link>
    </p>
  )
}
