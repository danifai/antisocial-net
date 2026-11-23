import { useAuth } from '../context/AuthContext'
import Feed from './Feed'
import Landing from './Landing'

/** "/" muestra la portada a visitantes y el feed a usuarios con sesión (como Instagram/Facebook). */
export default function Home() {
  const { user } = useAuth()
  return user ? <Feed /> : <Landing />
}
