import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { errorMessage } from '../../services/api'

interface Errors {
  nickName?: string
  password?: string
}

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  // ProtectedRoute guarda en `state.from` la ruta que se quiso visitar.
  const from = (location.state as { from?: { pathname: string } } | null)?.from
    ?.pathname

  const [nickName, setNickName] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    const newErrors: Errors = {}
    if (!nickName.trim()) newErrors.nickName = 'Ingresá tu nickName'
    if (!password) newErrors.password = 'Ingresá tu contraseña'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await login(nickName, password)
      navigate(from ?? '/', { replace: true })
    } catch (err) {
      setServerError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <Card className="auth-card">
      <Card.Body className="p-4">
        <h2 className="h4 mb-1">Ingresar</h2>
        <p className="text-secondary">Volvé a tu rincón tranquilo.</p>

        {from && !serverError && (
          <Alert variant="info">Ingresá para acceder a esa sección.</Alert>
        )}
        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="login-nickName">
            <Form.Label>NickName</Form.Label>
            <Form.Control
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value)
                setErrors((prev) => ({ ...prev, nickName: undefined }))
              }}
              isInvalid={!!errors.nickName}
              autoComplete="username"
            />
            <Form.Control.Feedback type="invalid">
              {errors.nickName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="login-password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setErrors((prev) => ({ ...prev, password: undefined }))
              }}
              isInvalid={!!errors.password}
              autoComplete="current-password"
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
            <Form.Text muted>
              Login simulado: la contraseña es siempre <code>123456</code>.
            </Form.Text>
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </Form>

        <hr className="my-4" />
        <p className="text-center mb-2 small">¿Todavía no tenés cuenta?</p>
        <Link to="/registro" className="btn btn-outline-primary w-100">
          Registrarme
        </Link>
      </Card.Body>
    </Card>
  )
}
