import Badge from '../../componets/Badge/Badge.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { usuariosService } from '../../services/usuarios.service.js'

const ROLES = [
  { valor: 'admin', etiqueta: 'Administrador' },
  { valor: 'empleado', etiqueta: 'Empleado' },
  { valor: 'cliente', etiqueta: 'Cliente' },
]

const ESTADOS = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
]

const ROL_TONO = { admin: 'danger', empleado: 'azure', cliente: 'warn' }

const columnas = [
  {
    key: 'nombre',
    header: 'Usuario',
    sortable: true,
    render: (f) => <strong>{f.nombre}</strong>,
  },
  { key: 'correo', header: 'Correo', sortable: true, render: (f) => f.correo || '—' },
  {
    key: 'usuario',
    header: 'Usuario',
    sortable: true,
    render: (f) => (f.usuario ? <span className="mono">{f.usuario}</span> : '—'),
  },
  {
    key: 'rol',
    header: 'Rol',
    sortable: true,
    render: (f) => (
      <Badge tone={ROL_TONO[f.rol] || 'neutral'}>{ROLES.find((r) => r.valor === f.rol)?.etiqueta || f.rol}</Badge>
    ),
  },
  {
    key: 'estado',
    header: 'Estado',
    sortable: true,
    render: (f) => (
      <Badge tone={f.estado === 'activo' ? 'ok' : 'warn'}>{f.estado === 'activo' ? 'Activo' : 'Inactivo'}</Badge>
    ),
  },
]

const campos = [
  { nombre: 'nombre', etiqueta: 'Nombre completo', tipo: 'texto', obligatorio: true },
  { nombre: 'correo', etiqueta: 'Correo', tipo: 'correo', obligatorio: true },
  { nombre: 'usuario', etiqueta: 'Usuario de acceso (opcional)', tipo: 'texto' },
  { nombre: 'contrasena', etiqueta: 'Contraseña (opcional, mínimo 6)', tipo: 'clave' },
  { nombre: 'rol', etiqueta: 'Rol', tipo: 'seleccion', opciones: ROLES, obligatorio: true },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'seleccion', opciones: ESTADOS, obligatorio: true },
]

export default function Usuarios() {
  return (
    <ListadoView
      titulo="Usuarios"
      descripcion="Control de acceso por rol al sistema."
      modulo="Usuario"
      servicio={usuariosService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['nombre', 'correo', 'usuario']}
      filtros={[
        { nombre: 'rol', etiqueta: 'Rol', opciones: ROLES },
        { nombre: 'estado', etiqueta: 'Estado', opciones: ESTADOS },
      ]}
    />
  )
}