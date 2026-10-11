import Badge from '../../componets/Badge/Badge.jsx'
import ListadoView from '../../componets/views/ListadoView.jsx'
import { materialesService } from '../../services/materiales.service.js'

const UNIDADES = [
  { valor: 'und', etiqueta: 'Unidad' },
  { valor: 'm2', etiqueta: 'Metro cuadrado' },
  { valor: 'm3', etiqueta: 'Metro cúbico' },
  { valor: 'ml', etiqueta: 'Metro lineal' },
  { valor: 'kg', etiqueta: 'Kilogramo' },
  { valor: 'gl', etiqueta: 'Galón' },
]

const columnas = [
  { key: 'codigo', header: 'Código', sortable: true, render: (f) => <span className="mono">{f.codigo}</span> },
  { key: 'nombre', header: 'Material', sortable: true, render: (f) => <strong>{f.nombre}</strong> },
  {
    key: 'unidad',
    header: 'Unidad',
    sortable: true,
    render: (f) => UNIDADES.find((u) => u.valor === f.unidad)?.etiqueta || f.unidad || '—',
  },
  { key: 'cantidad', header: 'Stock', align: 'num', sortable: true, render: (f) => f.cantidad ?? '—' },
  {
    key: 'stockMinimo',
    header: 'Mínimo',
    align: 'num',
    sortable: true,
    render: (f) =>
      (f.cantidad != null && f.stockMinimo != null && f.cantidad < f.stockMinimo) ? (
        <Badge tone="warn">Bajo stock</Badge>
      ) : (
        f.stockMinimo ?? '—'
      ),
  },
  {
    key: 'precioUnitario',
    header: 'Precio (S/)',
    align: 'num',
    sortable: true,
    render: (f) => (f.precioUnitario != null ? Number(f.precioUnitario).toLocaleString('es-PE') : '—'),
  },
]

const campos = [
  { nombre: 'codigo', etiqueta: 'Código', tipo: 'texto', obligatorio: true },
  { nombre: 'nombre', etiqueta: 'Nombre del material', tipo: 'texto', obligatorio: true },
  { nombre: 'unidad', etiqueta: 'Unidad', tipo: 'seleccion', opciones: UNIDADES, obligatorio: true },
  { nombre: 'cantidad', etiqueta: 'Stock actual', tipo: 'numero', minimo: 0 },
  { nombre: 'stockMinimo', etiqueta: 'Stock mínimo', tipo: 'numero', minimo: 0 },
  { nombre: 'precioUnitario', etiqueta: 'Precio unitario (S/)', tipo: 'numero', minimo: 0 },
  { nombre: 'descripcion', etiqueta: 'Descripción', tipo: 'lista' },
]

export default function Materiales() {
  return (
    <ListadoView
      titulo="Materiales"
      descripcion="Control de existencias y precios del almacén."
      modulo="Material"
      servicio={materialesService}
      columnas={columnas}
      campos={campos}
      camposBusqueda={['nombre', 'codigo']}
      filtros={[{ nombre: 'unidad', etiqueta: 'Unidad', opciones: UNIDADES }]}
    />
  )
}