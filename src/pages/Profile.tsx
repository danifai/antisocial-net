import { useEffect, useState } from 'react'
import { Alert, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import LogoutModal from '../components/auth/LogoutModal'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PostCard from '../components/common/PostCard'
import { useAuth } from '../context/AuthContext'
import { errorMessage, getPosts } from '../services/api'
import type { Post } from '../types/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingLogout, setConfirmingLogout] = useState(false)

  useEffect(() => {
    if (!user) return

    let cancelled = false
    getPosts(user.id)
      .then((data) => {
        if (!cancelled) {
          setPosts([...data].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
        }
      })
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [user])

  function handleLogout() {
    setConfirmingLogout(false)
    logout()
    navigate('/')
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">@{user?.nickName}</h1>
          <p className="text-secondary mb-0">Tus publicaciones, sin apuro.</p>
        </div>
        <Button variant="outline-primary" onClick={() => setConfirmingLogout(true)}>
          <i className="bi bi-box-arrow-right me-2" />
          Cerrar sesión
        </Button>
      </div>

      <section aria-labelledby="profile-posts-title">
        <h2 id="profile-posts-title" className="h5 mb-3">
          Mis publicaciones
        </h2>

        {loading && <LoadingSpinner />}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && posts.length === 0 && (
          <Card className="text-center">
            <Card.Body className="py-5">
              <p className="text-secondary mb-0">
                Todavía no publicaste nada. Mejor así, ¿no?
              </p>
            </Card.Body>
          </Card>
        )}

        {!error &&
          posts.map((post) => <PostCard key={post.id} post={post} variant="perfil" />)}
      </section>

      <LogoutModal
        show={confirmingLogout}
        onHide={() => setConfirmingLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  )
}
