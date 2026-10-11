import { useState } from 'react'
import useListado from '../../hooks/useListado.js'
import { useToast } from '../../hooks/useToast.js'
import Icon from '../Icon/Icon.jsx'
import Button from '../Button/Button.jsx'
import { Card } from '../Card/Card.jsx'
import Field from '../Form/Field.jsx'
import Input from '../Form/Input.jsx'
import Select from '../Form/Select.jsx'
import Textarea from '../Form/Textarea.jsx'
import Switch from '../Form/Switch.jsx'
import Table from '../Table/Table.jsx'
import Toolbar from '../Toolbar/Toolbar.jsx'
import Modal from '../Modal/Modal.jsx'
import ConfirmDialog from '../Modal/ConfirmDialog.jsx'

function valoresIniciales(campos, fila) {
  const base = {}
  campos.forEach((c) => {
    if (fila && fila[c.nombre] !== undefined) {
      base[c.nombre] = fila[c.nombre]
    } else {
      base[c.nombre] = c.tipo === 'interruptor' ? false : c.tipo === 'numero' ? '' : ''
    }
  })
  return base
}

function validar(campos, valores) {
  const errores = {}
  campos.forEach((c) => {
    const v = valores[c.nombre]
    const vacio = v === '' || v == null || (tipoTexto(c.tipo) && !String(v).trim())
    if (c.obligatorio && vacio) {
      errores[c.nombre] = 'Este campo es obligatorio.'
    } else if (c.tipo === 'correo' && v && !/^\S+@\S+\.\S+$/.test(String(v))) {
      errores[c.nombre] = 'Ingresa un correo válido.'
    } else if (c.tipo === 'numero' && v !== '' && v != null) {
      const n = Number(v)
      if (c.minimo != null && n < c.minimo) errores[c.nombre] = `Mínimo: ${c.minimo}.`
      if (c.maximo != null && n > c.maximo) errores[c.nombre] = `Máximo: ${c.maximo}.`
    }
  })
  return errores
}

function tipoTexto(tipo) {
  return !['numero', 'interruptor'].includes(tipo)
}

function controlDe(campo, comunes) {
  if (campo.tipo === 'seleccion') {
    return (
      <Select {...comunes}>
        <option value="">Seleccionar…</option>
        {(campo.opciones || []).map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </Select>
    )
  }
  if (campo.tipo === 'lista') {
    return <Textarea {...comunes} rows={3} />
  }
  if (campo.tipo === 'numero') {
    return <Input {...comunes} type="number" />
  }
  if (campo.tipo === 'fecha') {
    return <Input {...comunes} type="date" />
  }
  if (campo.tipo === 'clave') {
    return <Input {...comunes} type="password" autoComplete="new-password" />
  }
  if (campo.tipo === 'interruptor') {
    return <Switch id={campo.nombre} aria-label={campo.etiqueta} {...comunes} />
  }
  return <Input {...comunes} type={campo.tipo === 'correo' ? 'email' : 'text'} />
}

function Campo({ campo, valor, onChange, error }) {
  const comunes = {
    id: campo.nombre,
    nombre: campo.nombre,
    value: valor,
    onChange: (e) => {
      if (campo.tipo === 'interruptor') onChange(e.target.checked)
      else onChange(e.target.value)
    },
    invalid: !!error,
    required: campo.obligatorio,
  }

  return (
    <Field label={campo.etiqueta} htmlFor={campo.nombre} required={campo.obligatorio} error={error}>
      {controlDe(campo, comunes)}
    </Field>
  )
}

function FormularioModulo({ campos, editando, enviando, onCancelar, onGuardar, modulo }) {
  const [valores, setValores] = useState(() => valoresIniciales(campos, editando))
  const [errores, setErrores] = useState({})

  function enviar(e) {
    e.preventDefault()
    const nuevos = validar(campos, valores)
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return
    onGuardar(valores)
  }

  return (
    <Modal
      open
      title={editando ? `Editar ${modulo}` : `Nuevo ${modulo}`}
      onClose={onCancelar}
      foot={
        <>
          <Button variant="outline" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </Button>
          <Button form="formulario-modulo" type="submit" loading={enviando}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="formulario-modulo" noValidate onSubmit={enviar}>
        <div className="form-grid">
          {campos.map((c) => (
            <Campo
              key={c.nombre}
              campo={c}
              valor={valores[c.nombre]}
              onChange={(v) => setValores((previos) => ({ ...previos, [c.nombre]: v }))}
              error={errores[c.nombre]}
            />
          ))}
        </div>
      </form>
    </Modal>
  )
}

export default function ListadoView({
  titulo,
  descripcion,
  modulo,
  servicio,
  columnas,
  campos,
  camposBusqueda = ['nombre'],
  filtros = [],
  limite = 10,
  extraAcciones = [],
  mensajeVacio,
}) {
  const { mostrar } = useToast()
  const estado = useListado({ servicio, limite, camposBusqueda, filtrosOpciones: filtros })

  const acciones = [
    { id: 'editar', etiqueta: 'Editar', icono: 'edit', onClick: estado.abrirEdicion },
    {
      id: 'eliminar',
      etiqueta: 'Eliminar',
      icono: 'trash',
      danger: true,
      onClick: estado.confirmarEliminar,
    },
    ...extraAcciones,
  ]

  async function guardarFormulario(valoresFormulario) {
    const resultado = await estado.guardar(valoresFormulario)
    if (resultado.ok) {
      mostrar(
        'ok',
        estado.editando ? 'Cambios guardados' : `${modulo} creado`,
        `El registro quedó actualizado.`,
      )
    } else {
      mostrar('danger', 'No se pudo guardar', resultado.error)
    }
  }

  async function confirmarBorrado() {
    const resultado = await estado.eliminar(estado.confirmando)
    if (resultado.ok) {
      mostrar('ok', `${modulo} eliminado`, `El registro se eliminó correctamente.`)
    } else {
      mostrar('danger', 'No se pudo eliminar', resultado.error)
    }
  }

  const vacio = estado.busqueda || Object.values(estado.filtros).some(Boolean)
    ? {
        variant: 'filtered',
        title: 'Sin coincidencias',
        message: 'Prueba con otros términos de búsqueda o quita los filtros.',
      }
    : {
        variant: 'empty',
        title: mensajeVacio?.title || `Todavía no hay ${modulo.toLowerCase()}s registrados`,
        message: mensajeVacio?.message || `Presiona “Nuevo ${modulo}” para comenzar.`,
      }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-head__title">{titulo}</h1>
          {descripcion ? <p className="page-head__meta">{descripcion}</p> : null}
        </div>
        <Button icon="plus" onClick={estado.abrirNuevo}>
          Nuevo {modulo}
        </Button>
      </div>

      <Card>
        <div className="card__body card__body--flush">
          <Toolbar
            busqueda={estado.busqueda}
            onBusqueda={estado.setBusqueda}
            placeholder={`Buscar en ${titulo.toLowerCase()}…`}
            filtros={estado.filtrosOpciones.map((f) => ({
              nombre: f.nombre,
              etiqueta: f.etiqueta,
              valor: estado.filtros[f.nombre] || '',
              opciones: f.opciones,
              onCambio: (v) => estado.setFiltro(f.nombre, v),
            }))}
            actions={
              <Button variant="ghost" icon="refresh" onClick={estado.recargar} loading={estado.cargando}>
                Actualizar
              </Button>
            }
          />
          <Table
            columnas={columnas}
            filas={estado.filas}
            cargando={estado.cargando}
            error={estado.error}
            vacio={vacio}
            orden={estado.orden}
            onOrden={estado.cambiarOrden}
            acciones={acciones}
          />
          {estado.totalPaginas > 1 ? (
            <div className="pagination">
              <span className="pagination__info">
                Página {estado.pagina} de {estado.totalPaginas} · {estado.total} registros
              </span>
              <Button
                variant="outline"
                icon="chevron-left"
                disabled={estado.pagina <= 1}
                onClick={() => estado.irPagina(estado.pagina - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={estado.pagina >= estado.totalPaginas}
                onClick={() => estado.irPagina(estado.pagina + 1)}
              >
                Siguiente
                <Icon name="chevron-right" size={16} />
              </Button>
            </div>
          ) : null}
        </div>
      </Card>

      {estado.formAbierto ? (
        <FormularioModulo
          key={estado.editando?.id ?? 'nuevo'}
          modulo={modulo}
          campos={campos}
          editando={estado.editando}
          enviando={estado.enviando}
          onCancelar={estado.cerrarForm}
          onGuardar={guardarFormulario}
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(estado.confirmando)}
        titulo={`¿Eliminar ${modulo}?`}
        mensaje={`Esta acción es irreversible y eliminará el registro de “${estado.confirmando?.nombre || estado.confirmando?.codigo || ''}”.`}
        confirmarLabel="Eliminar"
        cargando={estado.enviando}
        onConfirmar={confirmarBorrado}
        onClose={() => estado.confirmarEliminar(null)}
      />
    </>
  )
}