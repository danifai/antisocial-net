import type { PostImage } from '../../types/api'

const MAX_VISIBLE = 4

interface PostImagesProps {
  images: PostImage[]
  /** Versión alta para la vista de detalle. */
  large?: boolean
}

/** Galería con alto fijo: 1 foto ocupa todo, 2 van en columnas, 3-4 en cuadrícula. */
export default function PostImages({ images, large = false }: PostImagesProps) {
  const shown = images.slice(0, MAX_VISIBLE)
  const extra = images.length - shown.length

  return (
    <div className={`post-media post-media-${shown.length}${large ? ' post-media-large' : ''}`}>
      {shown.map((img, i) => (
        <div key={img.id} className="post-media-item">
          <img
            src={img.url}
            alt={`Imagen ${i + 1} de la publicación`}
            loading="lazy"
            // Los placeholders externos pueden caerse: se oculta la imagen rota.
            onError={(e) => (e.currentTarget.hidden = true)}
          />
          {extra > 0 && i === shown.length - 1 && (
            <span className="post-media-more">+{extra}</span>
          )}
        </div>
      ))}
    </div>
  )
}
