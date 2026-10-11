import { useState } from 'react'
import { useAsync } from '../../hooks/useAsync.js'
import { useAuth } from '../../hooks/useAuth.js'
import { resumen } from '../../services/dashboard.service.js'
import Button from '../../componets/Button/Button.jsx'
import Stat from '../../componets/Stat/Stat.jsx'
import { Card, CardHead, CardBody } from '../../componets/Card/Card.jsx'
import Skeleton from '../../componets/State/Skeleton.jsx'
import Alert from '../../componets/Alert/Alert.jsx'
import EmptyState from '../../componets/Empty/EmptyState.jsx'
import { Barras, Dona } from '../../componets/Charts/Charts.jsx'
import Icon from '../../componets/Icon/Icon.jsx'

const ICONOS_ACTIVIDAD = {
  obra: 'obras',
  cotizacion: 'cotizaciones',
  contrato: 'contratos',
  cliente: 'clientes',
}

function EsqueletoTarjetas() {
  return (
    <div className="stats">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <div className="card__body">
            <Skeleton width="2.5rem" height="2.5rem" radius="var(--radius-md)" />
            <Skeleton width="5rem" height="1.5rem" />
            <Skeleton width="8rem" height="0.75rem" />
          </div>
        </Card>
      ))}
    </div>
  )
}

function EsqueletoCuerpo() {
  return (
    <>
      <EsqueletoTarjetas />
      <div className="grid grid--2">
        <Card>
          <CardHead title="Avance de obras" />
          <CardBody>
            <Skeleton height="10rem" />
          </CardBody>
        </Card>
        <Card>
          <CardHead title="Presupuesto por tipo" />
          <CardBody>
            <Skeleton height="10rem" />
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { sesion } = useAuth()
  const [intento, setIntento] = useState(0)
  const { datos, error, cargando } = useAsync(() => resumen(), [intento])
  const nombre = sesion?.usuario?.nombre

  const encabezado = (
    <div className="page-head">
      <div>
        <h1 className="page-head__title">Resumen</h1>
        <p className="page-head__meta">{nombre ? `Hola, ${nombre}` : ''}</p>
      </div>
      <Button variant="outline" icon="refresh" onClick={() => setIntento((i) => i + 1)}>
        Actualizar
      </Button>
    </div>
  )

  if (cargando) {
    return (
      <>
        {encabezado}
        <EsqueletoCuerpo />
      </>
    )
  }

  if (error) {
    return (
      <>
        {encabezado}
        <Alert tone="danger" title="No se pudo cargar el tablero">
          {error.mensaje || error.message || 'Intenta nuevamente en unos segundos.'}
        </Alert>
      </>
    )
  }

  if (!datos || Object.keys(datos).length === 0) {
    return (
      <>
        {encabezado}
        <Card>
          <CardBody>
            <EmptyState
              title="Aún no hay información consolidada"
              message="Cuando el sistema registre obras, contratos y cotizaciones, aquí verás los indicadores."
            />
          </CardBody>
        </Card>
      </>
    )
  }

  const indicadores = datos.indicadores || {}
  const avanceObras = datos.avanceObras || []
  const presupuesto = datos.presupuesto || {}
  const actividad = datos.actividad || []
  const alertas = datos.alertas || []

  const stats = [
    { icono: 'obras', tono: 'primary', label: 'Obras en curso', value: indicadores.obrasEnCurso ?? '—' },
    { icono: 'contratos', tono: 'matcha', label: 'Contratos activos', value: indicadores.contratosActivos ?? '—' },
    { icono: 'cotizaciones', tono: 'azure', label: 'Cotizaciones pendientes', value: indicadores.cotizacionesPendientes ?? '—' },
    { icono: 'clientes', tono: 'primary', label: 'Clientes registrados', value: indicadores.clientesRegistrados ?? '—' },
  ]

  return (
    <>
      {encabezado}

      <div className="stats">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid--2">
        <Card>
          <CardHead title="Avance de obras" />
          <CardBody>
            {avanceObras.length > 0 ? (
              <Barras datos={avanceObras} />
            ) : (
              <EmptyState
                title="Sin avances registrados"
                message="El avance por obra aparecerá cuando existan registros."
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHead title="Presupuesto por tipo" />
          <CardBody>
            {presupuesto.segmentos && presupuesto.segmentos.length > 0 ? (
              <Dona
                segmentos={presupuesto.segmentos}
                total={presupuesto.total ?? '—'}
                titulo="Presupuesto"
              />
            ) : (
              <EmptyState
                title="Sin presupuesto"
                message="El desglose aparecerá al asignar presupuestos."
              />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid--2">
        <Card>
          <CardHead title="Actividad reciente" />
          <CardBody flush>
            {actividad.length > 0 ? (
              <ul className="activity-list">
                {actividad.map((a, i) => (
                  <li key={i}>
                    <span className="activity-list__icon">
                      <Icon name={ICONOS_ACTIVIDAD[a?.tipo] || 'dots'} size={16} />
                    </span>
                    <span className="activity-list__body">
                      <span className="activity-list__text">{a.texto}</span>
                      <span className="activity-list__time">{a.hora}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Sin actividad reciente"
                message="Los cambios del sistema aparecerán aquí."
              />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHead title="Alertas operativas" />
          <CardBody flush>
            {alertas.length > 0 ? (
              <ul className="alert-list">
                {alertas.map((a, i) => (
                  <li key={i} className={`alert-list__alert alert-list__alert--${a.tono || 'info'}`}>
                    <Icon name={a.tono === 'danger' ? 'alert' : 'info'} size={16} />
                    <span>{a.texto}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="Sin alertas"
                message="No hay situaciones que requieran tu atención."
              />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  )
}