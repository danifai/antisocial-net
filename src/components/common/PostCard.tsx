import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getComments, getPostImages } from '../../services/api'
import type { Post, PostImage } from '../../types/api'
import { formatDateTime, timeAgo } from '../../utils/date'
import Avatar from './Avatar'
import PostImages from './PostImages'
import TagChip from './TagChip'

interface PostCardProps {
  post: Post
  /** `feed`: con imágenes y etiquetas (Home). `perfil`: solo descripción y comentarios. */
  variant?: 'feed' | 'perfil'
  /** Si se pasa, las etiquetas son botones (ej. para filtrar el feed). */
  onTagClick?: (tagId: number) => void
}

export default function PostCard({ post, variant = 'feed', onTagClick }: PostCardProps) {
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

  const nickName = post.User?.nickName ?? 'anónimo'
  const tags = post.Tags ?? []
  const label = commentCount === 1 ? 'comentario' : 'comentarios'

  return (
    <Card className="post-card mb-3">
      <Card.Body>
        <header className="d-flex align-items-center gap-2 mb-3">
          <Avatar nickName={nickName} />
          <div className="lh-sm">
            <div className="fw-semibold">@{nickName}</div>
            <time
              dateTime={post.createdAt}
              title={formatDateTime(post.createdAt)}
              className="small text-secondary"
            >
              {timeAgo(post.createdAt)}
            </time>
          </div>
        </header>

        <Card.Text className="post-text line-clamp-4">{post.description}</Card.Text>

        {isFeed && images.length > 0 && <PostImages images={images} />}

        {isFeed && tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mt-3">
            {tags.map((tag) => (
              <TagChip
                key={tag.id}
                label={`#${tag.name}`}
                onClick={onTagClick && (() => onTagClick(tag.id))}
              />
            ))}
          </div>
        )}

        <footer className="post-footer d-flex justify-content-between align-items-center mt-3 pt-3">
          <Link to={`/post/${post.id}`} className="comments-link small">
            <i className="bi bi-chat me-1" />
            {commentCount === null ? '–' : `${commentCount} ${label}`}
          </Link>
          {/* Pedido por la consigna; el link de comentarios lleva al mismo lugar a propósito. */}
          <Link to={`/post/${post.id}`} className="btn btn-outline-primary btn-sm">
            Ver más
          </Link>
        </footer>
      </Card.Body>
    </Card>
  )
}
