import Badge from '../../componets/Badge/Badge.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { proveedoresService } from '../../services/proveedores.service.js'

const RUBROS = [
  { valor: 'materiales', etiqueta: 'Materiales' },
  { valor: 'equipos', etiqueta: 'Equipos' },
  { valor: 'servicios', etiqueta: 'Servicios' },
  { valor: 'logistica', etiqueta: 'Logística' },
]

const ESTADOS = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
]

const columnas = [
  {
    key: 'nombre',
    header: 'Proveedor',
    sortable: true,
    render: (f) => <strong>{f.nombre}</strong>,
  },
  { key: 'ruc', header: 'RUC', sortable: true, render: (f) => <span className="mono">{f.ruc || '—'}</span> },
  {
    key: 'rubro',
    header: 'Rubro',
    sortable: true,
    render: (f) => RUBROS.find((r) => r.valor === f.rubro)?.etiqueta || f.rubro || '—',
  },
  { key: 'correo', header: 'Correo', sortable: true, render: (f) => f.correo || '—' },
  { key: 'telefono', header: 'Teléfono', sortable: true, render: (f) => f.telefono || '—' },
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
  { nombre: 'nombre', etiqueta: 'Nombre de la empresa', tipo: 'texto', obligatorio: true },
  { nombre: 'ruc', etiqueta: 'RUC', tipo: 'texto', obligatorio: true },
  { nombre: 'rubro', etiqueta: 'Rubro', tipo: 'seleccion', opciones: RUBROS, obligatorio: true },
  { nombre: 'correo', etiqueta: 'Correo', tipo: 'correo' },
  { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'texto' },
  { nombre: 'direccion', etiqueta: 'Dirección', tipo: 'texto' },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'seleccion', opciones: ESTADOS, obligatorio: true },
]

export default function Proveedores() {
  return (
    <ListadoView
      titulo="Proveedores"
      descripcion="Empresas que abastecen materiales, equipos y servicios."
      modulo="Proveedor"
      servicio={proveedoresService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['nombre', 'ruc', 'correo']}
      filtros={[
        { nombre: 'rubro', etiqueta: 'Rubro', opciones: RUBROS },
        { nombre: 'estado', etiqueta: 'Estado', opciones: ESTADOS },
      ]}
    />
  )
}