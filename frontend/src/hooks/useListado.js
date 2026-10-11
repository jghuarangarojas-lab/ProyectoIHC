import { useCallback, useEffect, useMemo, useState } from 'react'

function conBusquedaYFiltros(filas, busqueda, camposBusqueda, filtros) {
  let resultado = filas

  const termino = busqueda.trim().toLowerCase()
  if (termino) {
    resultado = resultado.filter((f) =>
      camposBusqueda.some((campo) => String(f[campo] ?? '').toLowerCase().includes(termino)),
    )
  }

  const nombresFiltros = Object.keys(filtros)
  if (nombresFiltros.length > 0) {
    resultado = resultado.filter((f) =>
      nombresFiltros.every((n) => !filtros[n] || String(f[n]) === filtros[n]),
    )
  }

  return resultado
}

function comparar(a, b, campo, direccion) {
  const va = a?.[campo]
  const vb = b?.[campo]
  let resultado
  if (typeof va === 'number' && typeof vb === 'number') {
    resultado = va - vb
  } else {
    resultado = String(va ?? '').localeCompare(String(vb ?? ''), 'es', { sensitivity: 'base' })
  }
  return direccion === 'asc' ? resultado : -resultado
}

export default function useListado({
  servicio,
  limite = 10,
  camposBusqueda = ['nombre'],
  filtrosOpciones = [],
}) {
  const [todos, setTodos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState({})
  const [orden, setOrden] = useState({ campo: 'id', direccion: 'asc' })
  const [pagina, setPagina] = useState(1)
  const [enviando, setEnviando] = useState(false)
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [confirmando, setConfirmando] = useState(null)

  const cargar = useCallback(async () => {
    try {
      const datos = await servicio.listar()
      setTodos(Array.isArray(datos) ? datos : [])
      setError(null)
    } catch (e) {
      setError(e.mensaje || e.message || 'No se pudo cargar el listado.')
      setTodos([])
    } finally {
      setCargando(false)
    }
  }, [servicio])

  useEffect(() => {
    let activo = true
    Promise.resolve().then(() => {
      if (activo) cargar()
    })
    return () => {
      activo = false
    }
  }, [cargar])

  const filtrado = useMemo(
    () => conBusquedaYFiltros(todos, busqueda, camposBusqueda, filtros),
    [todos, busqueda, camposBusqueda, filtros],
  )

  const ordenado = useMemo(
    () => [...filtrado].sort((a, b) => comparar(a, b, orden.campo, orden.direccion)),
    [filtrado, orden],
  )

  const total = ordenado.length
  const totalPaginas = Math.max(1, Math.ceil(total / limite))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const filas = useMemo(
    () => ordenado.slice((paginaSegura - 1) * limite, paginaSegura * limite),
    [ordenado, paginaSegura, limite],
  )

  function cambiarOrden(campo, direccion) {
    setOrden({ campo, direccion })
  }

  function setFiltro(nombre, valor) {
    setFiltros((previos) => ({ ...previos, [nombre]: valor }))
    setPagina(1)
  }

  async function guardar(formulario) {
    setEnviando(true)
    try {
      if (editando) {
        await servicio.actualizar(editando.id, formulario)
      } else {
        await servicio.crear(formulario)
      }
      setFormAbierto(false)
      setEditando(null)
      await cargar()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.mensaje || e.message || 'No se pudo guardar.' }
    } finally {
      setEnviando(false)
    }
  }

  async function eliminar(fila) {
    setEnviando(true)
    try {
      await servicio.eliminar(fila.id)
      setConfirmando(null)
      await cargar()
      return { ok: true }
    } catch (e) {
      setConfirmando(null)
      return { ok: false, error: e.mensaje || e.message || 'No se pudo eliminar.' }
    } finally {
      setEnviando(false)
    }
  }

  function abrirNuevo() {
    setEditando(null)
    setFormAbierto(true)
  }

  function abrirEdicion(fila) {
    setEditando(fila)
    setFormAbierto(true)
  }

  return {
    filas,
    total,
    pagina: paginaSegura,
    totalPaginas,
    cargando,
    error,
    busqueda,
    setBusqueda: (v) => {
      setBusqueda(v)
      setPagina(1)
    },
    filtros,
    filtrosOpciones,
    setFiltro,
    orden,
    cambiarOrden,
    irPagina: setPagina,
    recargar: () => {
      setCargando(true)
      cargar()
    },
    formAbierto,
    editando,
    abrirNuevo,
    abrirEdicion,
    cerrarForm: () => {
      setFormAbierto(false)
      setEditando(null)
    },
    confirmando,
    confirmarEliminar: setConfirmando,
    guardar,
    eliminar,
    enviando,
  }
}