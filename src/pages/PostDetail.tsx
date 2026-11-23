import { useEffect, useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Avatar from '../components/common/Avatar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PostImages from '../components/common/PostImages'
import TagChip from '../components/common/TagChip'
import { useAuth } from '../context/AuthContext'
import {
  createComment,
  errorMessage,
  getComments,
  getPost,
  getPostImages,
} from '../services/api'
import type { Comment, Post, PostImage } from '../types/api'
import { formatDateTime, timeAgo } from '../utils/date'

// Los comentarios se leen como una conversación: el más viejo primero.
const sortOldestFirst = (comments: Comment[]) =>
  [...comments].sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export default function PostDetail() {
  const { id } = useParams()
  // `key` remonta la vista al cambiar de post: el estado vuelve a "cargando" sin resetearlo a mano.
  return <PostDetailView key={id} postId={Number(id)} />
}

function PostDetailView({ postId }: { postId: number }) {
  const { user } = useAuth()

  const [post, setPost] = useState<Post | null>(null)
  const [images, setImages] = useState<PostImage[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [content, setContent] = useState('')
  const [contentError, setContentError] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    let cancelled = false

    Promise.all([getPost(postId), getPostImages(postId), getComments(postId)])
      .then(([postData, imagesData, commentsData]) => {
        if (cancelled) return
        setPost(postData)
        setImages(imagesData)
        setComments(sortOldestFirst(commentsData))
      })
      .catch((err) => !cancelled && setError(errorMessage(err)))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [postId])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !post) return
    setSent(false)
    setSendError('')

    if (!content.trim()) {
      setContentError('Escribí algo antes de comentar')
      return
    }

    setSending(true)
    try {
      await createComment({ content: content.trim(), userId: user.id, postId: post.id })
      // La API no devuelve el autor del comentario nuevo: se vuelve a pedir la lista.
      setComments(sortOldestFirst(await getComments(post.id)))
      setContent('')
      setSent(true)
    } catch (err) {
      setSendError(errorMessage(err))
    } finally {
      setSending(false)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error || !post) {
    return (
      <div className="post-detail mx-auto text-center py-5">
        <Alert variant="danger">{error || 'Publicación no encontrada'}</Alert>
        <Link to="/" className="btn btn-outline-primary">
          Volver al inicio
        </Link>
      </div>
    )
  }

  const nickName = post.User?.nickName ?? 'anónimo'
  const tags = post.Tags ?? []

  return (
    <div className="post-detail mx-auto">
      <Link to="/" className="d-inline-block mb-3 small">
        <i className="bi bi-arrow-left me-1" />
        Volver
      </Link>

      <Card>
        <Card.Body className="p-4">
          <header className="d-flex align-items-center gap-3 mb-3">
            <Avatar nickName={nickName} size={48} />
            <div className="lh-sm">
              <div className="fw-semibold">@{nickName}</div>
              <time dateTime={post.createdAt} className="small text-secondary">
                {formatDateTime(post.createdAt)} · {timeAgo(post.createdAt)}
              </time>
            </div>
          </header>

          <p className="post-text post-description">{post.description}</p>

          {images.length > 0 && <PostImages images={images} large />}

          {tags.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <TagChip key={tag.id} label={`#${tag.name}`} />
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      <section className="mt-4" aria-labelledby="comments-title">
        <h2 id="comments-title" className="h5 mb-3">
          Comentarios <span className="text-secondary">({comments.length})</span>
        </h2>

        {comments.length === 0 && (
          <p className="text-secondary">
            Nadie comentó todavía. Perfecto, nadie te obliga.
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id} className="d-flex gap-2 mb-3">
            <Avatar nickName={comment.User?.nickName ?? 'anónimo'} size={36} />
            <div className="comment-bubble flex-grow-1">
              <div className="d-flex justify-content-between gap-2 small mb-1">
                <span className="fw-semibold">@{comment.User?.nickName ?? 'anónimo'}</span>
                <time
                  dateTime={comment.createdAt}
                  title={formatDateTime(comment.createdAt)}
                  className="text-secondary"
                >
                  {timeAgo(comment.createdAt)}
                </time>
              </div>
              <p className="post-text mb-0">{comment.content}</p>
            </div>
          </div>
        ))}

        {user ? (
          <Card className="mt-4">
            <Card.Body>
              {sent && (
                <Alert variant="success" dismissible onClose={() => setSent(false)}>
                  Comentario publicado.
                </Alert>
              )}
              {sendError && <Alert variant="danger">{sendError}</Alert>}

              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="comment-content" className="mb-3">
                  <Form.Label>Tu comentario, @{user.nickName}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value)
                      setContentError('')
                    }}
                    isInvalid={!!contentError}
                    placeholder="Solo si tenés ganas…"
                  />
                  <Form.Control.Feedback type="invalid">{contentError}</Form.Control.Feedback>
                </Form.Group>
                <div className="text-end">
                  <Button type="submit" disabled={sending}>
                    {sending ? 'Publicando…' : 'Comentar'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <Card className="mt-4 text-center">
            <Card.Body>
              <p className="mb-3">
                Para comentar necesitás una cuenta. Nadie te va a obligar a charlar.
              </p>
              <Link to="/" className="btn btn-primary me-2">
                Ingresar
              </Link>
              <Link to="/registro" className="btn btn-outline-primary">
                Registrarme
              </Link>
            </Card.Body>
          </Card>
        )}
      </section>
    </div>
  )
}
