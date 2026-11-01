import { leerDb } from '../database/db.js'

const ESTADOS_PRESUPUESTO = [
  { estado: 'programada', etiqueta: 'Programadas', color: '#94a3b8' },
  { estado: 'en-curso', etiqueta: 'En curso', color: '#0f766e' },
  { estado: 'pausada', etiqueta: 'Pausadas', color: '#f59e0b' },
  { estado: 'finalizada', etiqueta: 'Finalizadas', color: '#2563eb' },
]

const MODULOS = {
  obras: { singular: 'Obra', tipo: 'obra', actualizado: 'actualizada', creado: 'registrada' },
  materiales: {
    singular: 'Material',
    tipo: 'material',
    actualizado: 'actualizado',
    creado: 'registrado',
  },
  proveedores: {
    singular: 'Proveedor',
    tipo: 'proveedor',
    actualizado: 'actualizado',
    creado: 'registrado',
  },
  clientes: { singular: 'Cliente', tipo: 'cliente', actualizado: 'actualizado', creado: 'registrado' },
  cotizaciones: {
    singular: 'Cotización',
    tipo: 'cotizacion',
    actualizado: 'actualizada',
    creado: 'registrada',
  },
  contratos: {
    singular: 'Contrato',
    tipo: 'contrato',
    actualizado: 'actualizado',
    creado: 'registrado',
  },
  usuarios: { singular: 'Usuario', tipo: 'usuario', actualizado: 'actualizado', creado: 'registrado' },
}

function suma(items, campo) {
  return items.reduce((total, item) => total + (Number(item[campo]) || 0), 0)
}

function promedio(items, campo) {
  if (items.length === 0) {
    return 0
  }

  return Math.round(suma(items, campo) / items.length)
}

function formatearMonto(valor) {
  if (valor >= 1000000) {
    return `S/ ${(valor / 1000000).toFixed(1)}M`
  }

  if (valor >= 1000) {
    return `S/ ${Math.round(valor / 1000)}K`
  }

  return `S/ ${Math.round(valor)}`
}

function fechaCorta(valor) {
  const fecha = new Date(valor)

  if (Number.isNaN(fecha.getTime())) {
    return ''
  }

  return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })
}

function horaCorta(valor) {
  const fecha = new Date(valor)

  if (Number.isNaN(fecha.getTime())) {
    return ''
  }

  const minutos = Math.round((Date.now() - fecha.getTime()) / 60000)

  if (minutos < 60) {
    return `hace ${Math.max(1, minutos)} min`
  }

  const horas = Math.round(minutos / 60)

  if (horas < 24) {
    return `hace ${horas} h`
  }

  const dias = Math.round(horas / 24)

  if (dias < 7) {
    return `hace ${dias} d`
  }

  return fechaCorta(valor)
}

function hoy() {
  return new Date().toISOString().slice(0, 10)
}

export async function obtenerResumen() {
  const db = await leerDb()
  const obras = db.obras || []
  const materiales = db.materiales || []
  const contratos = db.contratos || []
  const cotizaciones = db.cotizaciones || []
  const clientes = db.clientes || []
  const proveedores = db.proveedores || []

  const obrasActivas = obras.filter((obra) => obra.estado === 'en-curso').length
  const materialesBajoStock = materiales.filter(
    (material) => Number(material.cantidad) < Number(material.stockMinimo),
  )
  const cotizacionesPendientes = cotizaciones.filter(
    (cotizacion) => cotizacion.estado === 'pendiente',
  ).length
  const contratosActivos = contratos.filter((contrato) => contrato.estado === 'activo').length
  const presupuestoTotal = suma(obras, 'presupuesto')
  const presupuestoActivo = suma(
    obras.filter((obra) => obra.estado !== 'finalizada'),
    'presupuesto',
  )

  const presupuestoPorEstado = {}

  for (const grupo of ESTADOS_PRESUPUESTO) {
    const items = obras.filter((obra) => obra.estado === grupo.estado)
    presupuestoPorEstado[grupo.estado] = {
      etiqueta: grupo.etiqueta,
      color: grupo.color,
      cantidad: items.length,
      monto: suma(items, 'presupuesto'),
    }
  }

  const segmentos = ESTADOS_PRESUPUESTO.filter(
    (grupo) => presupuestoPorEstado[grupo.estado].monto > 0,
  ).map((grupo) => ({
    etiqueta: grupo.etiqueta,
    valor: presupuestoPorEstado[grupo.estado].monto,
    valorEtiqueta: formatearMonto(presupuestoPorEstado[grupo.estado].monto),
    color: grupo.color,
  }))

  const avanceObras = [...obras]
    .sort((a, b) => Number(a.id) - Number(b.id))
    .slice(0, 6)
    .map((obra) => {
      const nombre = obra.nombre || obra.codigo || `Obra ${obra.id}`
      return {
        nombre,
        etiqueta: nombre.length > 14 ? `${nombre.slice(0, 13)}…` : nombre,
        valor: Number(obra.avance) || 0,
        avance: Number(obra.avance) || 0,
      }
    })

  const eventos = []

  for (const [recurso, modulo] of Object.entries(MODULOS)) {
    for (const item of db[recurso] || []) {
      const titulo = item.nombre || item.codigo || item.usuario || item.correo || `#${item.id}`
      const base = { tipo: modulo.tipo, titulo, detalle: titulo }

      if (item.actualizadoEn) {
        eventos.push({
          ...base,
          fecha: item.actualizadoEn,
          texto: `${modulo.singular} ${modulo.actualizado}: ${titulo}`,
        })
      }

      if (item.creadoEn) {
        eventos.push({
          ...base,
          fecha: item.creadoEn,
          texto: `${modulo.singular} ${modulo.creado}: ${titulo}`,
        })
      }
    }
  }

  eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const actividad = eventos.slice(0, 6).map((evento) => ({
    tipo: evento.tipo,
    texto: evento.texto,
    detalle: evento.detalle,
    fecha: evento.fecha,
    hora: horaCorta(evento.fecha),
  }))

  const limite = hoy()
  const alertas = []

  for (const material of materialesBajoStock.slice(0, 4)) {
    alertas.push({
      tono: 'danger',
      texto: `Stock bajo de ${material.nombre}: ${material.cantidad} ${material.unidad} disponibles.`,
    })
  }

  for (const obra of obras.filter((item) => item.estado === 'pausada')) {
    alertas.push({ tono: 'info', texto: `Obra pausada: ${obra.nombre}.` })
  }

  for (const cotizacion of cotizaciones) {
    const caducada =
      cotizacion.estado === 'vencida' ||
      (cotizacion.estado === 'pendiente' && cotizacion.validez && cotizacion.validez < limite)

    if (caducada) {
      alertas.push({
        tono: 'danger',
        texto: `Cotización ${cotizacion.codigo} vencida o fuera de vigencia.`,
      })
    }
  }

  for (const contrato of contratos) {
    if (contrato.estado === 'activo' && contrato.fechaFin && contrato.fechaFin < limite) {
      alertas.push({
        tono: 'danger',
        texto: `Contrato ${contrato.codigo} con fecha de fin superada.`,
      })
    }
  }

  if (alertas.length === 0) {
    alertas.push({ tono: 'info', texto: 'No hay alertas críticas registradas.' })
  }

  return {
    indicadores: {
      obrasEnCurso: obrasActivas,
      contratosActivos,
      cotizacionesPendientes,
      clientesRegistrados: clientes.length,
      materialesBajoStock: materialesBajoStock.length,
      avancePromedio: promedio(obras, 'avance'),
      presupuestoTotal,
    },
    presupuesto: {
      total: formatearMonto(presupuestoTotal),
      activo: presupuestoActivo,
      segmentos,
      porEstado: presupuestoPorEstado,
    },
    avanceObras,
    actividad,
    alertas: alertas.slice(0, 8),
    presupuestoTotal,
    presupuestoActivo,
    obrasActivas,
    totalObras: obras.length,
    avancePromedio: promedio(obras, 'avance'),
    totalMateriales: materiales.length,
    materialesBajoStock: materialesBajoStock.length,
    materialesCriticos: materialesBajoStock.map((material) => ({
      nombre: material.nombre,
      cantidad: Number(material.cantidad) || 0,
      stockMinimo: Number(material.stockMinimo) || 0,
      unidad: material.unidad,
    })),
    cotizacionesPendientes,
    contratosActivos,
    clientesActivos: clientes.filter((cliente) => cliente.estado === 'activo').length,
    proveedoresActivos: proveedores.filter((proveedor) => proveedor.estado === 'activo').length,
    presupuestoPorEstado,
  }
}
