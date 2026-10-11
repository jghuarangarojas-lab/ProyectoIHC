import Badge from '../../componets/Badge/Badge.jsx'
import Progress from '../../componets/State/Progress.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { obrasService } from '../../services/obras.service.js'

const ESTADOS = [
  { valor: 'programada', etiqueta: 'Programada' },
  { valor: 'en-curso', etiqueta: 'En curso' },
  { valor: 'pausada', etiqueta: 'Pausada' },
  { valor: 'finalizada', etiqueta: 'Finalizada' },
]

const TONO_ESTADO = { programada: 'azure', 'en-curso': 'primary', pausada: 'warn', finalizada: 'ok' }

function etiquetaEstado(valor) {
  return ESTADOS.find((e) => e.valor === valor)?.etiqueta || valor
}

const columnas = [
  {
    key: 'codigo',
    header: 'Código',
    sortable: true,
    render: (f) => <span className="mono">{f.codigo}</span>,
  },
  {
    key: 'nombre',
    header: 'Obra',
    sortable: true,
    render: (f) => <strong>{f.nombre}</strong>,
  },
  {
    key: 'estado',
    header: 'Estado',
    sortable: true,
    render: (f) => (
      <Badge tone={TONO_ESTADO[f.estado] || 'neutral'}>{etiquetaEstado(f.estado)}</Badge>
    ),
  },
  {
    key: 'cliente',
    header: 'Cliente',
    sortable: true,
    render: (f) => f.cliente || '—',
  },
  {
    key: 'presupuesto',
    header: 'Presupuesto',
    align: 'num',
    sortable: true,
    render: (f) => (f.presupuesto != null ? Number(f.presupuesto).toLocaleString('es-PE') : '—'),
  },
  {
    key: 'avance',
    header: 'Avance',
    sortable: true,
    render: (f) => <Progress value={Number(f.avance) || 0} max={100} />,
  },
]

const campos = [
  { nombre: 'codigo', etiqueta: 'Código', tipo: 'texto', obligatorio: true },
  { nombre: 'nombre', etiqueta: 'Nombre de la obra', tipo: 'texto', obligatorio: true },
  { nombre: 'cliente', etiqueta: 'Cliente', tipo: 'texto', obligatorio: true },
  { nombre: 'ubicacion', etiqueta: 'Ubicación', tipo: 'texto' },
  { nombre: 'presupuesto', etiqueta: 'Presupuesto (S/)', tipo: 'numero', minimo: 0 },
  { nombre: 'avance', etiqueta: 'Avance (%)', tipo: 'numero', minimo: 0, maximo: 100 },
  { nombre: 'fechaInicio', etiqueta: 'Fecha de inicio', tipo: 'fecha' },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'seleccion', opciones: ESTADOS, obligatorio: true },
  { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'lista' },
]

export default function Obras() {
  return (
    <ListadoView
      titulo="Obras"
      descripcion="Proyectos de construcción en cartera de la empresa."
      modulo="Obra"
      servicio={obrasService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['nombre', 'codigo', 'cliente']}
      filtros={[
        { nombre: 'estado', etiqueta: 'Estado', opciones: ESTADOS },
      ]}
    />
  )
}
