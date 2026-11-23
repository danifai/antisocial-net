/* oxlint-disable react/only-export-components -- provider y hook conviven en un solo archivo a propósito */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getUsers } from '../services/api'
import type { User } from '../types/api'

// Login simulado: la consigna fija la contraseña y se valida solo en el cliente.
const PASSWORD = '123456'
const STORAGE_KEY = 'antisocial_user'

interface AuthContextValue {
  user: User | null
  login: (nickName: string, password: string) => Promise<void>
  startSession: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as User) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser)

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  async function login(nickName: string, password: string) {
    const users = await getUsers()
    const found = users.find((u) => u.nickName === nickName.trim())
    // Mensaje único: no se revela si falló el usuario o la contraseña.
    if (!found || password !== PASSWORD) {
      throw new Error('Usuario o contraseña incorrectos')
    }
    setUser(found)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, startSession: setUser, logout: () => setUser(null) }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
