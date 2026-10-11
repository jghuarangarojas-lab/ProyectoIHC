export const ICONOS = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  obras: (
    <>
      <path d="M4 20V5l6-2v17" />
      <path d="M10 20h10" />
      <path d="M14 9h5v11h-5z" />
    </>
  ),
  clientes: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19c1-3.5 3.3-5.5 7-5.5s6 2 7 5.5" />
    </>
  ),
  proveedores: (
    <>
      <path d="M3 6.5h18v4H3z" />
      <path d="M3 10.5v9h18v-9" />
      <path d="M3 13.5h18" />
      <path d="M7 6.5V3.5h10v3" />
    </>
  ),
  materiales: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5L12 12l8-4.5" />
      <path d="M12 12v9" />
    </>
  ),
  cotizaciones: (
    <>
      <path d="M6 3.5h8l4 4v13H6z" />
      <path d="M14 3.5v4h4" />
      <path d="M9.5 12h5M9.5 15h5" />
    </>
  ),
  contratos: (
    <>
      <path d="M5 3.5h9l5 5v12H5z" />
      <path d="M14 3.5v5h5" />
      <path d="M9 13.5l1.8 1.8L15 11.5" />
    </>
  ),
  usuarios: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.7-3 2.8-4.7 5.5-4.7s4.8 1.7 5.5 4.7" />
      <circle cx="17.5" cy="9" r="2.2" />
      <path d="M16 14.6c2.1.2 3.8 1.6 4.5 4.4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20.5 20.5l-4.3-4.3" />
    </>
  ),
  bell: (
    <>
      <path d="M18 16H6l1.5-5a4.5 4.5 0 0 1 9 0z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
    </>
  ),
  moon: <path d="M20 13.5A8 8 0 1 1 10.5 4a6.5 6.5 0 0 0 9.5 9.5z" />,
  'chevron-down': <path d="M6 9l6 6 6-6" />,
  'chevron-up': <path d="M6 15l6-6 6 6" />,
  'chevron-left': <path d="M15 6l-6 6 6 6" />,
  'chevron-right': <path d="M9 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  dots: (
    <>
      <circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </>
  ),
  filter: <path d="M4 6h16M7 12h10M10 18h4" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  alert: (
    <>
      <path d="M12 3.5L21 20H3z" />
      <path d="M12 10v4.5M12 17.5v.1" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5M12 8v.1" />
    </>
  ),
  trash: (
    <>
      <path d="M4 6.5h16M9 6.5V4.5h6v2M6.5 6.5l1 13h9l1-13" />
      <path d="M10 10.5v5.5M14 10.5v5.5" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4.5L19.5 9a2 2 0 0 0 0-2.8l-.7-.7a2 2 0 0 0-2.8 0L5 16.5z" />
      <path d="M14 6.5l3.5 3.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5V15M7 10.5l5 5 5-5" />
      <path d="M4 19.5h16" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8V3.5h10V8M7 17h-2a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 5 8.5h14A1.5 1.5 0 0 1 20.5 10v5.5A1.5 1.5 0 0 1 19 17h-2" />
      <rect x="7" y="14" width="10" height="6.5" rx="1" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4h4.5v16H14" />
      <path d="M9 8l4 4-4 4M13 12H3.5" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4v4h-4" />
    </>
  ),
  panel: <path d="M9 3.5v17M3.5 4.5h17v15h-17z" />,
  inbox: (
    <>
      <path d="M3.5 13.5h5l1.5 2.5h4l1.5-2.5h5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19z" />
      <path d="M3.5 13.5V6A1.5 1.5 0 0 1 5 4.5h14A1.5 1.5 0 0 1 20.5 6v7.5M3.5 13.5l4.2-1.7a1 1 0 0 1 .6 0L9.4 13M20.5 13.5l-4.2-1.7a1 1 0 0 0-.6 0L14.6 13" />
    </>
  ),
}