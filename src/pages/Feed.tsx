import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PostCard from '../components/common/PostCard'
import TagChip from '../components/common/TagChip'
import { useAuth } from '../context/AuthContext'
import { errorMessage, getPosts, getTags } from '../services/api'
import type { Post, Tag } from '../types/api'

const PAGE_SIZE = 6

/** Feed de publicaciones recientes: lo que ve en "/" quien tiene sesión iniciada. */
export default function Feed() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedTag, setSelectedTag] = useState<number | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [showFab, setShowFab] = useState(false)
  const writeButtonRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const button = writeButtonRef.current
    if (!button) return
    // Solo si el botón quedó por encima de la pantalla (scrolleó hacia abajo).
    const observer = new IntersectionObserver(([entry]) =>
      setShowFab(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    )
    observer.observe(button)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    Promise.all([getPosts(), getTags()])
      .then(([postsData, tagsData]) => {
        // La API no ordena: los más recientes primero.
        setPosts([...postsData].sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
        setTags(tagsData)
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  // Tocar la etiqueta activa vuelve a mostrar todo.
  function toggleTag(tagId: number | null) {
    setSelectedTag((prev) => (prev === tagId ? null : tagId))
    setVisible(PAGE_SIZE)
  }

  const filtered = posts.filter(
    (post) => selectedTag === null || post.Tags?.some((tag) => tag.id === selectedTag),
  )

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h3 mb-1">Hola, @{user?.nickName}</h1>
          <p className="text-secondary mb-0">
            Lo último de quienes prefieren no hacer ruido.
          </p>
        </div>
        <Link ref={writeButtonRef} to="/nuevo-post" className="btn btn-primary">
          <i className="bi bi-pencil-square me-2" />
          Escribir algo
        </Link>
      </div>

      {/* Botón flotante: aparece cuando "Escribir algo" ya no se ve al scrollear */}
      <Link
        to="/nuevo-post"
        className={`fab-write${showFab ? ' visible' : ''}`}
        aria-label="Escribir algo"
        title="Escribir algo"
        tabIndex={showFab ? 0 : -1}
      >
        <i className="bi bi-pencil-square" />
      </Link>

      <Row className="g-4">
        <Col lg={8} className="order-2 order-lg-1">
          {loading && <LoadingSpinner />}
          {error && <Alert variant="danger">{error}</Alert>}

          {!loading && !error && filtered.length === 0 && (
            <Card className="text-center">
              <Card.Body className="py-5">
                <p className="mb-3 text-secondary">
                  {selectedTag === null
                    ? 'Todavía no publicó nadie. Mejor así: sé el primero cuando quieras.'
                    : 'No hay publicaciones con esa etiqueta.'}
                </p>
                {selectedTag !== null && (
                  <Button variant="outline-primary" size="sm" onClick={() => toggleTag(null)}>
                    Ver todas
                  </Button>
                )}
              </Card.Body>
            </Card>
          )}

          {filtered.slice(0, visible).map((post) => (
            <PostCard key={post.id} post={post} onTagClick={toggleTag} />
          ))}

          {filtered.length > visible && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Cargar más
              </Button>
            </div>
          )}
        </Col>

        <Col lg={4} className="order-1 order-lg-2">
          <aside className="feed-sidebar">
            <Card className="mb-3 d-none d-lg-block">
              <Card.Body>
                <h2 className="h6 text-uppercase text-secondary mb-3">Sobre nosotros</h2>
                <p className="small mb-2">
                  Una red para quienes prefieren escribir antes que hablar. Acá no hay likes
                  ni seguidores: solo posts, y comentarios cuando tengas ganas.
                </p>
                <p className="small text-secondary mb-0">
                  Dato curioso: una tortuga puede pasar horas dentro de su caparazón y nadie
                  se lo reprocha.
                </p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body className="py-3">
                <h2 className="h6 text-uppercase text-secondary mb-2">Etiquetas</h2>
                <div className="tag-filter">
                  <TagChip
                    label="Todas"
                    active={selectedTag === null}
                    onClick={() => toggleTag(null)}
                  />
                  {tags.map((tag) => (
                    <TagChip
                      key={tag.id}
                      label={`#${tag.name}`}
                      active={selectedTag === tag.id}
                      onClick={() => toggleTag(tag.id)}
                    />
                  ))}
                </div>
              </Card.Body>
            </Card>
          </aside>
        </Col>
      </Row>
    </>
  )
}
