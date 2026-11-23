import { Container } from 'react-bootstrap'
import logo from '../../assets/logo-tortuga.png'

export default function Footer() {
  return (
    <footer className="app-footer py-4 mt-auto">
      <Container className="text-center small">
        <img src={logo} alt="" className="footer-logo mb-2" />
        <p className="mb-1 fw-semibold">UnaHur Anti-Social Net</p>
        <p className="mb-1">Sin likes. Sin seguidores. Sin presión.</p>
        <p className="mb-0 text-secondary">
          TP2 · Construcción de Interfaces de Usuario · UnaHur · 2026
        </p>
      </Container>
    </footer>
  )
}
