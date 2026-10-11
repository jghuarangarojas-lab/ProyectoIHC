import Badge from '../../componets/Badge/Badge.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { contratosService } from '../../services/contratos.service.js'

const ESTADOS = [
  { valor: 'borrador', etiqueta: 'Borrador' },
  { valor: 'activo', etiqueta: 'Activo' },
  { valor: 'finalizado', etiqueta: 'Finalizado' },
  { valor: 'rescindido', etiqueta: 'Rescindido' },
]

const TONO_ESTADO = { borrador: 'neutral', activo: 'ok', finalizado: 'azure', rescindido: 'danger' }

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
  { key: 'fechaInicio', header: 'Inicio', sortable: true, render: (f) => f.fechaInicio || '—' },
  { key: 'fechaFin', header: 'Fin', sortable: true, render: (f) => f.fechaFin || '—' },
]

const campos = [
  { nombre: 'codigo', etiqueta: 'Código', tipo: 'texto', obligatorio: true },
  { nombre: 'obra', etiqueta: 'Obra', tipo: 'texto', obligatorio: true },
  { nombre: 'cliente', etiqueta: 'Cliente', tipo: 'texto', obligatorio: true },
  { nombre: 'monto', etiqueta: 'Monto (S/)', tipo: 'numero', minimo: 0 },
  { nombre: 'fechaInicio', etiqueta: 'Fecha de inicio', tipo: 'fecha' },
  { nombre: 'fechaFin', etiqueta: 'Fecha de fin', tipo: 'fecha' },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'seleccion', opciones: ESTADOS, obligatorio: true },
  { nombre: 'clausulas', etiqueta: 'Cláusulas relevantes', tipo: 'lista' },
]

export default function Contratos() {
  return (
    <ListadoView
      titulo="Contratos"
      descripcion="Contratos vigentes y su control de fechas."
      modulo="Contrato"
      servicio={contratosService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['codigo', 'cliente', 'obra']}
      filtros={[{ nombre: 'estado', etiqueta: 'Estado', opciones: ESTADOS }]}
    />
  )
}