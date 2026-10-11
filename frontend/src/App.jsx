import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { useAuth } from './hooks/useAuth.js'
import { useRoute } from './hooks/useRoute.js'
import { menuDisponible } from './config/nav.js'
import AppShell from './componets/Layout/AppShell.jsx'
import Login from './pages/Login/Login.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Obras from './pages/Obras/Obras.jsx'
import Clientes from './pages/Clientes/Clientes.jsx'
import Proveedores from './pages/Proveedores/Proveedores.jsx'
import Materiales from './pages/Materiales/Materiales.jsx'
import Cotizaciones from './pages/Cotizaciones/Cotizaciones.jsx'
import Contratos from './pages/Contratos/Contratos.jsx'
import Usuarios from './pages/Usuarios/Usuarios.jsx'

const PAGINAS = [
  { ruta: '/dashboard', etiqueta: 'Resumen', componente: Dashboard },
  { ruta: '/obras', etiqueta: 'Obras', componente: Obras },
  { ruta: '/clientes', etiqueta: 'Clientes', componente: Clientes },
  { ruta: '/proveedores', etiqueta: 'Proveedores', componente: Proveedores },
  { ruta: '/materiales', etiqueta: 'Materiales', componente: Materiales },
  { ruta: '/cotizaciones', etiqueta: 'Cotizaciones', componente: Cotizaciones },
  { ruta: '/contratos', etiqueta: 'Contratos', componente: Contratos },
  { ruta: '/usuarios', etiqueta: 'Usuarios', componente: Usuarios },
]

function Contenido() {
  const { ruta, navegar } = useRoute()
  const { sesion, rol } = useAuth()

  const pagina = PAGINAS.find((p) => p.ruta === ruta)
  const permitida =
    sesion &&
    Boolean(pagina) &&
    menuDisponible(rol).some((grupo) => grupo.items.some((item) => item.ruta === ruta))

  useEffect(() => {
    if (sesion && !permitida) {
      navegar('/dashboard')
    }
  }, [sesion, permitida, navegar])

  if (!sesion) {
    return <Login />
  }

  if (!pagina) {
    return null
  }

  const Componente = pagina.componente

  return (
    <AppShell pagina={pagina.etiqueta}>
      <Componente />
    </AppShell>
  )
}

function AppRaiz() {
  const { sesion } = useAuth()

  return (
    <ThemeProvider usuarioId={sesion?.usuario?.id}>
      <ToastProvider>
        <Contenido />
      </ToastProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRaiz />
    </AuthProvider>
  )
}