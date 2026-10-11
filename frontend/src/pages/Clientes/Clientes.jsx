import Badge from '../../componets/Badge/Badge.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { clientesService } from '../../services/clientes.service.js'

const ESTADOS = [
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'inactivo', etiqueta: 'Inactivo' },
]

const columnas = [
  {
    key: 'nombre',
    header: 'Cliente',
    sortable: true,
    render: (f) => <strong>{f.nombre}</strong>,
  },
  { key: 'documento', header: 'Documento', sortable: true, render: (f) => <span className="mono">{f.documento || '—'}</span> },
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
  { nombre: 'nombre', etiqueta: 'Nombre o razón social', tipo: 'texto', obligatorio: true },
  { nombre: 'documento', etiqueta: 'DNI / RUC', tipo: 'texto', obligatorio: true },
  { nombre: 'correo', etiqueta: 'Correo', tipo: 'correo' },
  { nombre: 'telefono', etiqueta: 'Teléfono', tipo: 'texto' },
  { nombre: 'direccion', etiqueta: 'Dirección', tipo: 'texto' },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'seleccion', opciones: ESTADOS, obligatorio: true },
]

export default function Clientes() {
  return (
    <ListadoView
      titulo="Clientes"
      descripcion="Cartera de clientes de la empresa."
      modulo="Cliente"
      servicio={clientesService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['nombre', 'documento', 'correo']}
      filtros={[{ nombre: 'estado', etiqueta: 'Estado', opciones: ESTADOS }]}
    />
  )
}