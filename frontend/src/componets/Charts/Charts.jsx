export function Barras({ datos, altura = 190, color, etiquetas = true }) {
  const max = Math.max(...datos.map((d) => d.valor), 1)

  return (
    <div className="chart-barras" style={{ '--altura-grafico': `${altura}px` }}>
      <div className="chart-barras__ejes" role="img" aria-label="Gráfico de barras">
        {datos.map((d, i) => {
          const h = Math.max(2, (d.valor / max) * 100)
          return (
            <div className="chart-barras__col" key={`${d.etiqueta}-${i}`}>
              <span className="chart-barras__valor">{d.valor}</span>
              <span
                className="chart-barras__barra"
                style={{ height: `${h}%`, backgroundColor: color || `var(--chart-${(i % 4) + 1})` }}
              />
            </div>
          )
        })}
      </div>
      {etiquetas ? (
        <div className="chart-barras__etiquetas">
          {datos.map((d, i) => (
            <span key={`${d.etiqueta}-${i}`}>{d.etiqueta}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function Dona({ segmentos, tamano = 168, titulo, total }) {
  const grosor = tamano * 0.14
  const radio = (tamano - grosor) / 2
  const circum = 2 * Math.PI * radio
  const suma = segmentos.reduce((acc, s) => acc + s.valor, 0) || 1
  const arcos = segmentos.map((s, i) => {
    const parte = (s.valor / suma) * circum
    const previo = segmentos.slice(0, i).reduce((acc, x) => acc + (x.valor / suma) * circum, 0)
    return { ...s, parte, offset: circum - previo }
  })

  return (
    <div className="dona">
      <svg
        width={tamano}
        height={tamano}
        viewBox={`0 0 ${tamano} ${tamano}`}
        role="img"
        aria-label={titulo}
      >
        <circle
          cx={tamano / 2}
          cy={tamano / 2}
          r={radio}
          fill="none"
          stroke="var(--stroke-3)"
          strokeWidth={grosor}
        />
        {arcos.map((s) => (
          <circle
            key={s.etiqueta}
            cx={tamano / 2}
            cy={tamano / 2}
            r={radio}
            fill="none"
            stroke={s.color || 'var(--primary)'}
            strokeWidth={grosor}
            strokeDasharray={`${s.parte} ${circum - s.parte}`}
            strokeDashoffset={s.offset}
            style={{ transition: 'all 0.3s ease' }}
          />
        ))}
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          fontSize={tamano * 0.16}
          fontWeight="700"
          fill="var(--ink-1)"
        >
          {total ?? suma}
        </text>
        <text
          x="50%"
          y="57%"
          textAnchor="middle"
          fontSize={tamano * 0.07}
          fill="var(--ink-3)"
        >
          {titulo}
        </text>
      </svg>
      <div className="chart-legend">
        {segmentos.map((s, i) => (
          <span key={i} className="chart-legend__item">
            <span
              className="chart-legend__swatch"
              style={{ backgroundColor: s.color || `var(--chart-${(i % 4) + 1})` }}
            />
            {s.etiqueta} · {s.valor}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Espiga({ valores, altura = 56, color }) {
  const max = Math.max(...valores, 1)
  const min = Math.min(...valores, 0)
  const rango = max - min || 1
  const puntos = valores
    .map((v, i) => {
      const x = ((1.5 + (v / 3) * i) / valores.length) * 100
      const y = 4 + (1 - (v - min) / rango) * (altura - 8)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg
      className="espiga"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox={`0 0 100 ${altura}`}
    >
      <polyline
        points={puntos}
        fill="none"
        stroke={color || 'var(--primary)'}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}