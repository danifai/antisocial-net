import { useEffect, useState } from 'react'
import { Alert, Carousel } from 'react-bootstrap'
import LoginForm from '../components/auth/LoginForm'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PostCard from '../components/common/PostCard'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { errorMessage, getPosts } from '../services/api'
import type { Post } from '../types/api'

const EXAMPLES = 5

function Slogan({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <h1 className={compact ? 'display-6' : 'display-5'}>
        Sin likes.
        <br />
        Sin seguidores.
        <br />
        <span className="text-primary">Sin presión.</span>
      </h1>
      <p className="lead text-secondary mb-0">
        La red donde nadie te pide que seas sociable. Publicá lo que quieras,
        cuando quieras, y que opine solo quien tenga ganas.
      </p>
    </>
  )
}

/**
 * Portada para visitantes sin sesión (slogan + posts reales de la API + login).
 * Desktop: slogan y debajo un carrusel de posts, login a la derecha.
 * Tablet/mobile: un único carrusel (slogan + posts) arriba del login.
 */
export default function Landing() {
  const isDesktop = useMediaQuery('(min-width: 992px)')
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPosts()
      .then((data) =>
        setPosts(
          [...data]
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, EXAMPLES),
        ),
      )
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  // En mobile el slogan también se muestra mientras carga o si no hay posts.
  const mobileSlogan = !isDesktop && (
    <div className="landing-slide landing-slide-slogan mb-3">
      <Slogan compact />
    </div>
  )

  return (
    <div className="landing">
      {isDesktop && (
        <section className="landing-hero">
          <Slogan />
        </section>
      )}

      <section className="landing-posts">
        {isDesktop && <h2 className="h5 mb-3">Lo último, sin hacer ruido</h2>}

        {loading && (
          <>
            {mobileSlogan}
            <LoadingSpinner />
          </>
        )}
        {error && (
          <>
            {mobileSlogan}
            <Alert variant="warning">{error}</Alert>
          </>
        )}
        {!loading && !error && posts.length === 0 && (
          <>
            {mobileSlogan}
            <p className="text-secondary">
              Todavía no publicó nadie. Mejor así: sé el primero cuando quieras.
            </p>
          </>
        )}
        {posts.length > 0 && (
          <Carousel
            controls={isDesktop}
            interval={6000}
            className="landing-carousel"
          >
            {!isDesktop && (
              <Carousel.Item>
                <div className="landing-slide landing-slide-slogan">
                  <Slogan compact />
                </div>
              </Carousel.Item>
            )}
            {posts.map((post) => (
              <Carousel.Item key={post.id}>
                <div className="landing-slide">
                  <PostCard post={post} />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </section>

      <div className="landing-login">
        <LoginForm />
      </div>
    </div>
  )
}
