import { useState } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { useAuth } from '../../hooks/useAuth.js'
import Sidebar from '../Sidebar/Sidebar.jsx'
import Topbar from '../Topbar/Topbar.jsx'

export default function AppShell({ children, pagina }) {
  const { rol, sesion } = useAuth()
  const escritorio = useMediaQuery('(min-width: 901px)')
  const [colapsado, setColapsado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [avisoCount] = useState(3)

  return (
    <div className={escritorio && colapsado ? 'app app--collapsed' : 'app'}>
      {!escritorio && menuAbierto ? (
        <div className="scrim" onClick={() => setMenuAbierto(false)} aria-hidden="true" />
      ) : null}

      <Sidebar
        rol={rol}
        usuario={sesion?.usuario}
        colapsado={colapsado}
        onColapsar={() => setColapsado((v) => !v)}
        abiertoMovil={!escritorio && menuAbierto}
        onNavegar={() => setMenuAbierto(false)}
      />

      <div className="main">
        <Topbar pagina={pagina} onMenu={() => setMenuAbierto(true)} avisoCount={avisoCount} />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}