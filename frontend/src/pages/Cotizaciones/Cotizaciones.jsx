import Badge from '../../componets/Badge/Badge.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { cotizacionesService } from '../../services/cotizaciones.service.js'

const ESTADOS = [
  { valor: 'pendiente', etiqueta: 'Pendiente' },
  { valor: 'aprobada', etiqueta: 'Aprobada' },
  { valor: 'rechazada', etiqueta: 'Rechazada' },
  { valor: 'vencida', etiqueta: 'Vencida' },
]

const TONO_ESTADO = { pendiente: 'warn', aprobada: 'ok', rechazada: 'danger', vencida: 'neutral' }

const columnas = [
  { key: 'codigo', header: 'Código', sortable: true, render: (f) => <span className="mono">{f.codigo}</span> },
  { key: 'obra', header: 'Obra', sortable: true, render: (f) => f.obra || '—' },
  { key: 'cliente', header: 'Cliente', sortable: true, render: (f) => f.cliente || '—' },
  {
    key: 'monto',
    header: 'Monto (S/)',
    align: 'num',
    sortable: true,
    render: (f) => (f.monto != null ? Number(f.monto).toLocaleString('es-PE') : '—'),
  },
  {
    key: 'estado',
    header: 'Estado',
    sortable: true,
    render: (f) => (
      <Badge tone={TONO_ESTADO[f.estado] || 'neutral'}>
        {ESTADOS.find((e) => e.valor === f.estado)?.etiqueta || f.estado}
      </Badge>
    ),
  },
  { key: 'fecha', header: 'Fecha', sortable: true, render: (f) => f.fecha || '—' },
]

const campos = [
  { nombre: 'codigo', etiqueta: 'Código', tipo: 'texto', obligatorio: true },
  { nombre: 'obra', etiqueta: 'Obra', tipo: 'texto' },
  { nombre: 'cliente', etiqueta: 'Cliente', tipo: 'texto', obligatorio: true },
  { nombre: 'monto', etiqueta: 'Monto (S/)', tipo: 'numero', minimo: 0 },
  { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'fecha' },
  { nombre: 'validez', etiqueta: 'Válida hasta', tipo: 'fecha' },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'seleccion', opciones: ESTADOS, obligatorio: true },
  { nombre: 'observaciones', etiqueta: 'Observaciones', tipo: 'lista' },
]

export default function Cotizaciones() {
  return (
    <ListadoView
      titulo="Cotizaciones"
      descripcion="Presupuestos enviados a clientes para su aprobación."
      modulo="Cotización"
      servicio={cotizacionesService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['codigo', 'cliente', 'obra']}
      filtros={[{ nombre: 'estado', etiqueta: 'Estado', opciones: ESTADOS }]}
    />
  )
}