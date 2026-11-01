const TODOS = ['admin', 'empleado', 'cliente']
const INTERNOS = ['admin', 'empleado']
const ADMIN = ['admin']

export const RECURSOS = {
  obras: {
    etiqueta: 'obra',
    roles: { leer: TODOS, escribir: INTERNOS },
    unicos: ['codigo'],
    campos: {
      codigo: { tipo: 'texto', etiqueta: 'El código', obligatorio: true, max: 40 },
      nombre: { tipo: 'texto', etiqueta: 'El nombre', obligatorio: true, max: 160 },
      cliente: { tipo: 'texto', etiqueta: 'El cliente', obligatorio: true, max: 160 },
      ubicacion: { tipo: 'texto', etiqueta: 'La ubicación', max: 200 },
      presupuesto: { tipo: 'numero', etiqueta: 'El presupuesto', min: 0 },
      avance: { tipo: 'numero', etiqueta: 'El avance', min: 0, max: 100 },
      fechaInicio: { tipo: 'fecha', etiqueta: 'La fecha de inicio' },
      estado: {
        tipo: 'enum',
        etiqueta: 'El estado',
        obligatorio: true,
        valores: ['programada', 'en-curso', 'pausada', 'finalizada'],
      },
      descripcion: { tipo: 'texto', etiqueta: 'La descripción', max: 2000 },
    },
  },
  materiales: {
    etiqueta: 'material',
    roles: { leer: INTERNOS, escribir: INTERNOS },
    unicos: ['codigo'],
    campos: {
      codigo: { tipo: 'texto', etiqueta: 'El código', obligatorio: true, max: 40 },
      nombre: { tipo: 'texto', etiqueta: 'El nombre', obligatorio: true, max: 160 },
      unidad: {
        tipo: 'enum',
        etiqueta: 'La unidad',
        obligatorio: true,
        valores: ['und', 'm2', 'm3', 'ml', 'kg', 'gl'],
      },
      cantidad: { tipo: 'numero', etiqueta: 'El stock actual', min: 0 },
      stockMinimo: { tipo: 'numero', etiqueta: 'El stock mínimo', min: 0 },
      precioUnitario: { tipo: 'numero', etiqueta: 'El precio unitario', min: 0 },
      descripcion: { tipo: 'texto', etiqueta: 'La descripción', max: 2000 },
    },
  },
  proveedores: {
    etiqueta: 'proveedor',
    roles: { leer: INTERNOS, escribir: INTERNOS },
    unicos: ['ruc'],
    campos: {
      nombre: { tipo: 'texto', etiqueta: 'El nombre', obligatorio: true, max: 160 },
      ruc: { tipo: 'texto', etiqueta: 'El RUC', obligatorio: true, max: 20 },
      rubro: {
        tipo: 'enum',
        etiqueta: 'El rubro',
        obligatorio: true,
        valores: ['materiales', 'equipos', 'servicios', 'logistica'],
      },
      correo: { tipo: 'correo', etiqueta: 'El correo', max: 160 },
      telefono: { tipo: 'texto', etiqueta: 'El teléfono', max: 40 },
      direccion: { tipo: 'texto', etiqueta: 'La dirección', max: 200 },
      estado: { tipo: 'enum', etiqueta: 'El estado', obligatorio: true, valores: ['activo', 'inactivo'] },
    },
  },
  clientes: {
    etiqueta: 'cliente',
    roles: { leer: INTERNOS, escribir: INTERNOS },
    unicos: ['documento'],
    campos: {
      nombre: { tipo: 'texto', etiqueta: 'El nombre', obligatorio: true, max: 160 },
      documento: { tipo: 'texto', etiqueta: 'El documento', obligatorio: true, max: 20 },
      correo: { tipo: 'correo', etiqueta: 'El correo', max: 160 },
      telefono: { tipo: 'texto', etiqueta: 'El teléfono', max: 40 },
      direccion: { tipo: 'texto', etiqueta: 'La dirección', max: 200 },
      estado: { tipo: 'enum', etiqueta: 'El estado', obligatorio: true, valores: ['activo', 'inactivo'] },
    },
  },
  cotizaciones: {
    etiqueta: 'cotización',
    roles: { leer: TODOS, escribir: INTERNOS },
    unicos: ['codigo'],
    campos: {
      codigo: { tipo: 'texto', etiqueta: 'El código', obligatorio: true, max: 40 },
      obra: { tipo: 'texto', etiqueta: 'La obra', max: 160 },
      cliente: { tipo: 'texto', etiqueta: 'El cliente', obligatorio: true, max: 160 },
      monto: { tipo: 'numero', etiqueta: 'El monto', min: 0 },
      fecha: { tipo: 'fecha', etiqueta: 'La fecha' },
      validez: { tipo: 'fecha', etiqueta: 'La validez' },
      estado: {
        tipo: 'enum',
        etiqueta: 'El estado',
        obligatorio: true,
        valores: ['pendiente', 'aprobada', 'rechazada', 'vencida'],
      },
      observaciones: { tipo: 'texto', etiqueta: 'Las observaciones', max: 2000 },
    },
  },
  contratos: {
    etiqueta: 'contrato',
    roles: { leer: TODOS, escribir: INTERNOS },
    unicos: ['codigo'],
    campos: {
      codigo: { tipo: 'texto', etiqueta: 'El código', obligatorio: true, max: 40 },
      obra: { tipo: 'texto', etiqueta: 'La obra', obligatorio: true, max: 160 },
      cliente: { tipo: 'texto', etiqueta: 'El cliente', obligatorio: true, max: 160 },
      monto: { tipo: 'numero', etiqueta: 'El monto', min: 0 },
      fechaInicio: { tipo: 'fecha', etiqueta: 'La fecha de inicio' },
      fechaFin: { tipo: 'fecha', etiqueta: 'La fecha de fin' },
      estado: {
        tipo: 'enum',
        etiqueta: 'El estado',
        obligatorio: true,
        valores: ['borrador', 'activo', 'finalizado', 'rescindido'],
      },
      clausulas: { tipo: 'texto', etiqueta: 'Las cláusulas', max: 4000 },
    },
  },
  usuarios: {
    etiqueta: 'usuario',
    roles: { leer: ADMIN, escribir: ADMIN },
    autenticacion: true,
    unicos: ['correo'],
    campos: {
      nombre: { tipo: 'texto', etiqueta: 'El nombre', obligatorio: true, max: 160 },
      correo: { tipo: 'correo', etiqueta: 'El correo', obligatorio: true, max: 160 },
      rol: {
        tipo: 'enum',
        etiqueta: 'El rol',
        obligatorio: true,
        valores: ['admin', 'empleado', 'cliente'],
      },
      estado: { tipo: 'enum', etiqueta: 'El estado', obligatorio: true, valores: ['activo', 'inactivo'] },
    },
  },
}

export function obtenerDefinicion(recurso) {
  return RECURSOS[recurso] || null
}
