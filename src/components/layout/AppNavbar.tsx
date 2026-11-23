import { useState } from 'react'
import { Button, Container, Modal, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Brand from './Brand'

export default function AppNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  function handleLogout() {
    setConfirmingLogout(false)
    logout()
    navigate('/')
  }

  // El logo lleva al inicio. Sin sesión el login y el registro están en la portada: solo se ve el logo.
  return (
    <>
      <Navbar className="app-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <Brand />
          </Navbar.Brand>

          {user && (
            <Nav>
              <NavDropdown
                align="end"
                id="user-menu"
                title={
                  <>
                    <i className="bi bi-person-circle me-1" />@{user.nickName}
                  </>
                }
              >
                <NavDropdown.Item as={Link} to="/perfil">
                  <i className="bi bi-person me-2" />
                  Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as="button" onClick={() => setConfirmingLogout(true)}>
                  <i className="bi bi-box-arrow-right me-2" />
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}
        </Container>
      </Navbar>

      <Modal
        show={confirmingLogout}
        onHide={() => setConfirmingLogout(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">
            Cerrar sesión
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Seguro que querés cerrar sesión?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setConfirmingLogout(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
