import { Button, Modal } from 'react-bootstrap'

interface LogoutModalProps {
  show: boolean
  onHide: () => void
  onConfirm: () => void
}

export default function LogoutModal({ show, onHide, onConfirm }: LogoutModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5">
          Cerrar sesión
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>¿Seguro que querés cerrar sesión?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Cerrar sesión
        </Button>
      </Modal.Footer>
    </Modal>
  )
}