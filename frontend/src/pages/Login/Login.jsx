import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import Logo from '../../componets/Logo/Logo.jsx'
import Button from '../../componets/Button/Button.jsx'
import Field from '../../componets/Form/Field.jsx'
import Input from '../../componets/Form/Input.jsx'
import Alert from '../../componets/Alert/Alert.jsx'

const DEMO_HABILITADO = import.meta.env.VITE_AUTH_DEMO === 'true'
const MOSTRAR_AYUDA = import.meta.env.DEV && !DEMO_HABILITADO

export default function Login() {
  const { ingresar } = useAuth()
  const { mostrar } = useToast()
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [errores, setErrores] = useState({})
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    const nuevos = {}
    if (!usuario.trim()) nuevos.usuario = 'Ingresa tu usuario.'
    if (!contrasena) nuevos.contrasena = 'Ingresa tu contraseña.'
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setEnviando(true)
    try {
      await ingresar(usuario, contrasena)
    } catch (err) {
      mostrar('danger', 'No se pudo iniciar sesión', err.mensaje || err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth">
      <main className="auth__panel">
        <div className="auth__brand">
          <Logo className="auth__logo" />
        </div>

        <h1 className="auth__heading">Acceso al sistema</h1>
        <p className="auth__sub">Smart Homes Constructores Generales S.A.C.</p>

        <form className="auth__card" noValidate onSubmit={enviar}>
          {MOSTRAR_AYUDA ? (
            <Alert tone="info" title="Acceso de desarrollo">
              Usa <strong>admin</strong> / <strong>admin123</strong> para ingresar con los datos de
              ejemplo.
            </Alert>
          ) : null}

          <Field label="Usuario" htmlFor="usuario" required error={errores.usuario}>
            <Input
              id="usuario"
              name="usuario"
              autoComplete="username"
              placeholder="ej. jperez"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              invalid={Boolean(errores.usuario)}
            />
          </Field>

          <Field label="Contraseña" htmlFor="contrasena" required error={errores.contrasena}>
            <Input
              id="contrasena"
              name="contrasena"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              invalid={Boolean(errores.contrasena)}
            />
          </Field>

          <Button type="submit" loading={enviando}>
            Entrar
          </Button>

          <p className="auth__foot">
            ¿Problemas para ingresar?{' '}
            <a href="mailto:sistemas@smarthomes.pe" onClick={(e) => e.preventDefault()}>
              Contacta al administrador
            </a>
          </p>
        </form>
      </main>
    </div>
  )
}