import { useState } from 'react'
import { Container, Nav, NavDropdown, Navbar } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import LogoutModal from '../auth/LogoutModal'
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
      <Navbar className="app-navbar sticky-top">
        <Container>
          <div className="d-flex align-items-center">
            <Navbar.Brand as={Link} to="/" className="brand">
              <Brand />
            </Navbar.Brand>

            {/* Solo desktop: en mobile/tablet este botón vive en la barra inferior. */}
            <NavLink
              to="/"
              end
              className="nav-home d-none d-lg-flex"
              onClick={() => window.scrollTo(0, 0)}
              aria-label={user ? 'Feed' : 'Inicio'}
              title={user ? 'Feed' : 'Inicio'}
            >
              <i className="bi bi-house-door" />
            </NavLink>
          </div>

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

      <LogoutModal
        show={confirmingLogout}
        onHide={() => setConfirmingLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}
