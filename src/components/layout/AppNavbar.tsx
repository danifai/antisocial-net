import { useState } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Brand from './Brand'

export default function AppNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  // Menú hamburguesa (mobile): se cierra solo al navegar.
  const [expanded, setExpanded] = useState(false)
  const close = () => setExpanded(false)

  function handleLogout() {
    close()
    logout()
    navigate('/')
  }

  // Sin sesión el login y el registro están en la portada: el header es solo el logo.
  if (!user) {
    return (
      <Navbar className="app-navbar">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <Brand />
          </Navbar.Brand>
        </Container>
      </Navbar>
    )
  }

  return (
    <Navbar
      expand="md"
      expanded={expanded}
      onToggle={setExpanded}
      className="app-navbar"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand" onClick={close}>
          <Brand />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end onClick={close}>
              Inicio
            </Nav.Link>
            <Nav.Link as={NavLink} to="/nuevo-post" onClick={close}>
              Nuevo post
            </Nav.Link>
          </Nav>
          <Nav className="align-items-md-center">
            <Nav.Link as={NavLink} to="/perfil" onClick={close}>
              <i className="bi bi-person-circle me-1" />@{user.nickName}
            </Nav.Link>
            <Button
              variant="outline-secondary"
              size="sm"
              className="ms-md-2 mt-2 mt-md-0 align-self-start"
              onClick={handleLogout}
            >
              Salir
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
