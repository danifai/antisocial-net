import { Link } from 'react-router-dom'
import logo from '../assets/logo-tortuga.png'

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <img src={logo} alt="" height={96} className="mb-3" />
      <h1 className="h3">Esta página no existe</h1>
      <p className="text-secondary">
        Tranqui: menos gente que te encuentre, mejor.
      </p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
