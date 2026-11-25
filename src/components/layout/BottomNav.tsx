import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AboutContent from '../common/AboutContent'

/** Barra inferior de mobile/tablet (en desktop no se muestra): Feed y "Sobre nosotros". */
export default function BottomNav() {
  const { user } = useAuth()
  const [showAbout, setShowAbout] = useState(false)

  return (
    <>
      <nav className="bottom-nav d-lg-none" aria-label="Navegación principal">
        <NavLink
          to="/"
          end
          className="bottom-nav-item"
          onClick={() => window.scrollTo(0, 0)}
          aria-label={user ? 'Feed' : 'Inicio'}
          title={user ? 'Feed' : 'Inicio'}
        >
          <i className="bi bi-house-door" />
        </NavLink>
        <button
          type="button"
          className={`bottom-nav-item${showAbout ? ' active' : ''}`}
          aria-label="Sobre nosotros"
          title="Sobre nosotros"
          onClick={() => setShowAbout(true)}
        >
          <i className="bi bi-info-circle" />
        </button>
      </nav>

      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">
            Sobre nosotros
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AboutContent />
        </Modal.Body>
      </Modal>
    </>
  )
}
