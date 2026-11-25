import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Feed from './Feed'
import Landing from './Landing'

/** "/" muestra la portada a visitantes y el feed a usuarios con sesión (como Instagram/Facebook). */
export default function Home() {
  const { user } = useAuth()
  // Tocar un link a "/" estando en "/" genera una `location.key` nueva: la `key` remonta la vista y vuelve a pedir los posts.
  const { key } = useLocation()
  return user ? <Feed key={key} /> : <Landing key={key} />
}
