import { useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { createUser, errorMessage } from '../services/api'

interface Errors {
  nickName?: string
  email?: string
}

export default function Register() {
  const { user, startSession } = useAuth()
  const navigate = useNavigate()

  const [nickName, setNickName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    const newErrors: Errors = {}
    if (!nickName.trim()) newErrors.nickName = 'Elegí un nickName'
    if (!email.trim()) newErrors.email = 'Ingresá tu email'
    else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      newErrors.email = 'El email no es válido'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      // La API valida que el nickName no exista y responde { error } si falla.
      const newUser = await createUser({
        nickName: nickName.trim(),
        email: email.trim(),
      })
      startSession(newUser)
      navigate('/', { replace: true })
    } catch (err) {
      setServerError(errorMessage(err))
      setLoading(false)
    }
  }

  return (
    <Card className="auth-card mx-auto">
      <Card.Body className="p-4">
        <h1 className="h3 mb-1">Crear cuenta</h1>
        <p className="text-secondary">Sin presión: solo necesitamos dos datos.</p>

        {serverError && <Alert variant="danger">{serverError}</Alert>}

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="register-nickName">
            <Form.Label>NickName</Form.Label>
            <Form.Control
              value={nickName}
              onChange={(e) => {
                setNickName(e.target.value)
                setErrors((prev) => ({ ...prev, nickName: undefined }))
              }}
              isInvalid={!!errors.nickName}
              autoComplete="username"
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              {errors.nickName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="register-email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setErrors((prev) => ({ ...prev, email: undefined }))
              }}
              isInvalid={!!errors.email}
              autoComplete="email"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Registrarme'}
          </Button>
        </Form>

        <p className="text-center mt-3 mb-0 small">
          ¿Ya tenés cuenta? <Link to="/">Ingresá</Link>
        </p>
      </Card.Body>
    </Card>
  )
}
