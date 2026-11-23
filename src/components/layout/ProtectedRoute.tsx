import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/** Envuelve rutas que requieren sesión; sin usuario redirige a "/" (portada con login) recordando el destino. */
export default function ProtectedRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/" replace state={{ from: location }} />
  return <Outlet />
}
