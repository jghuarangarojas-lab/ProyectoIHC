import Modal from './Modal.jsx'
import Button from '../Button/Button.jsx'

export default function ConfirmDialog({
  open,
  onClose,
  titulo = '¿Confirmar la operación?',
  mensaje,
  confirmarLabel = 'Confirmar',
  onConfirmar,
  cargando = false,
}) {
  return (
    <Modal
      open={open}
      title={titulo}
      onClose={onClose}
      foot={
        <>
          <Button variant="outline" onClick={onClose} disabled={cargando}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirmar} loading={cargando}>
            {confirmarLabel}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0 }}>{mensaje}</p>
    </Modal>
  )
}