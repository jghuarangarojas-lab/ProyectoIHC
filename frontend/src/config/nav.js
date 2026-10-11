export const GRUPOS_NAV = [
  {
    id: 'tablero',
    etiqueta: 'Tablero',
    items: [
      { id: 'dashboard', etiqueta: 'Resumen', icono: 'dashboard', ruta: '/dashboard', roles: ['admin', 'empleado', 'cliente'] },
    ],
  },
  {
    id: 'operaciones',
    etiqueta: 'Operaciones',
    items: [
      { id: 'obras', etiqueta: 'Obras', icono: 'obras', ruta: '/obras', roles: ['admin', 'empleado', 'cliente'] },
      { id: 'materiales', etiqueta: 'Materiales', icono: 'materiales', ruta: '/materiales', roles: ['admin', 'empleado'] },
      { id: 'proveedores', etiqueta: 'Proveedores', icono: 'proveedores', ruta: '/proveedores', roles: ['admin', 'empleado'] },
    ],
  },
  {
    id: 'comercial',
    etiqueta: 'Comercial',
    items: [
      { id: 'clientes', etiqueta: 'Clientes', icono: 'clientes', ruta: '/clientes', roles: ['admin', 'empleado'] },
      { id: 'cotizaciones', etiqueta: 'Cotizaciones', icono: 'cotizaciones', ruta: '/cotizaciones', roles: ['admin', 'empleado', 'cliente'] },
      { id: 'contratos', etiqueta: 'Contratos', icono: 'contratos', ruta: '/contratos', roles: ['admin', 'empleado', 'cliente'] },
    ],
  },
  {
    id: 'administracion',
    etiqueta: 'Administración',
    items: [
      { id: 'usuarios', etiqueta: 'Usuarios', icono: 'usuarios', ruta: '/usuarios', roles: ['admin'] },
    ],
  },
]

export function menuDisponible(rol) {
  return GRUPOS_NAV.map((grupo) => ({
    ...grupo,
    items: grupo.items.filter((item) => item.roles.includes(rol)),
  })).filter((grupo) => grupo.items.length > 0)
}