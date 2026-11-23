import { useEffect, useState } from 'react'
import { Badge, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getComments, getPostImages } from '../../services/api'
import type { Post, PostImage } from '../../types/api'

interface PostCardProps {
  post: Post
  /** `feed`: con imágenes y etiquetas (Home). `perfil`: solo descripción y comentarios. */
  variant?: 'feed' | 'perfil'
}

export default function PostCard({ post, variant = 'feed' }: PostCardProps) {
  const isFeed = variant === 'feed'
  // null = todavía no cargó o la API falló: se muestra un guion en lugar de un número falso.
  const [commentCount, setCommentCount] = useState<number | null>(null)
  const [images, setImages] = useState<PostImage[]>([])

  useEffect(() => {
    let cancelled = false

    getComments(post.id)
      .then((comments) => !cancelled && setCommentCount(comments.length))
      .catch(() => {})

    if (isFeed) {
      getPostImages(post.id)
        .then((data) => !cancelled && setImages(data))
        .catch(() => {})
    }

    return () => {
      cancelled = true
    }
  }, [post.id, isFeed])

  const tags = post.Tags ?? []
  const label = commentCount === 1 ? 'comentario' : 'comentarios'

  return (
    <Card className="post-card mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between text-secondary small mb-2">
          <span className="fw-semibold">@{post.User?.nickName ?? 'anónimo'}</span>
          <time dateTime={post.createdAt}>
            {new Date(post.createdAt).toLocaleDateString('es-AR', {
              dateStyle: 'medium',
            })}
          </time>
        </div>

        <Card.Text className="line-clamp-3">{post.description}</Card.Text>

        {isFeed && images.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt={`Imagen de la publicación ${post.id}`}
                className="post-thumb"
                loading="lazy"
                // Los placeholders externos pueden caerse: se oculta la imagen rota.
                onError={(e) => (e.currentTarget.hidden = true)}
              />
            ))}
          </div>
        )}

        {isFeed && tags.length > 0 && (
          <div className="d-flex flex-wrap gap-1 mb-3">
            {tags.map((tag) => (
              <Badge key={tag.id} bg="" className="tag-badge">
                #{tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-secondary small">
            <i className="bi bi-chat me-1" />
            {commentCount === null ? '–' : `${commentCount} ${label}`}
          </span>
          <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
            Ver más
          </Link>
        </div>
      </Card.Body>
    </Card>
  )
}
