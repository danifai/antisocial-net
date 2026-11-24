import { useEffect, useState, type FormEvent } from 'react'
import { Alert, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/common/LoadingSpinner'
import TagChip from '../components/common/TagChip'
import { useAuth } from '../context/AuthContext'
import { createPost, createPostImage, errorMessage, getTags } from '../services/api'
import type { Tag } from '../types/api'

function isValidUrl(value: string) {
  try {
    const { protocol } = new URL(value)
    return protocol === 'http:' || protocol === 'https:'
  } catch {
    return false
  }
}

/** Asocia cada URL al post. Devuelve las URLs que fallaron (las que sí salieron quedan guardadas). */
async function uploadImages(postId: number, urls: string[]): Promise<string[]> {
  const results = await Promise.allSettled(urls.map((url) => createPostImage({ url, postId })))
  return urls.filter((_, i) => results[i].status === 'rejected')
}

export default function NewPost() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [description, setDescription] = useState('')
  const [urls, setUrls] = useState<string[]>([''])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [descriptionError, setDescriptionError] = useState('')
  const [urlErrors, setUrlErrors] = useState<Record<number, string>>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [tags, setTags] = useState<Tag[]>([])
  const [tagsLoading, setTagsLoading] = useState(true)
  const [tagsError, setTagsError] = useState('')

  // Reintento: el post ya existe y la API no tiene DELETE, así que solo se repiten las imágenes.
  const [createdPostId, setCreatedPostId] = useState<number | null>(null)
  const [failedUrls, setFailedUrls] = useState<string[]>([])
  const [retrying, setRetrying] = useState(false)
  const retryMode = failedUrls.length > 0

  useEffect(() => {
    let cancelled = false

    getTags()
      .then((data) => !cancelled && setTags(data))
      .catch((err) => !cancelled && setTagsError(errorMessage(err)))
      .finally(() => !cancelled && setTagsLoading(false))

    return () => {
      cancelled = true
    }
  }, [])

  function goToProfile(notice: string, variant?: 'warning') {
    navigate('/perfil', { state: { notice, variant } })
  }

  function updateUrl(index: number, value: string) {
    setUrls((prev) => prev.map((url, i) => (i === index ? value : url)))
    setUrlErrors((prev) => ({ ...prev, [index]: '' }))
  }

  function removeUrl(index: number) {
    // Siempre queda un campo visible: si era el único, solo se vacía.
    setUrls((prev) => (prev.length === 1 ? [''] : prev.filter((_, i) => i !== index)))
    setUrlErrors({})
  }

  function toggleTag(tagId: number) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    setServerError('')

    const trimmedDescription = description.trim()
    const trimmedUrls = urls.map((url) => url.trim())

    const newUrlErrors: Record<number, string> = {}
    trimmedUrls.forEach((url, i) => {
      if (url && !isValidUrl(url)) {
        newUrlErrors[i] = 'La URL no es válida: tiene que empezar con http:// o https://'
      }
    })
    const newDescriptionError = trimmedDescription ? '' : 'Escribí algo antes de publicar'

    setDescriptionError(newDescriptionError)
    setUrlErrors(newUrlErrors)
    if (newDescriptionError || Object.keys(newUrlErrors).length > 0) return

    setSubmitting(true)
    try {
      // La API entiende `tagIds`; con `tags` guarda el post sin etiquetas y sin avisar.
      const post = await createPost({
        description: trimmedDescription,
        userId: user.id,
        tagIds: selectedTags,
      })
      setCreatedPostId(post.id)

      const failed = await uploadImages(post.id, trimmedUrls.filter(Boolean))
      if (failed.length === 0) goToProfile('Publicación creada.')
      else setFailedUrls(failed)
    } catch (err) {
      setServerError(errorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRetry() {
    if (createdPostId === null) return
    setRetrying(true)
    const stillFailed = await uploadImages(createdPostId, failedUrls)
    if (stillFailed.length === 0) {
      goToProfile('Publicación creada.')
    } else {
      setFailedUrls(stillFailed)
      setRetrying(false)
    }
  }

  function handleSkip() {
    const n = failedUrls.length
    const detail = n === 1 ? '1 imagen no se pudo subir.' : `${n} imágenes no se pudieron subir.`
    goToProfile(`Publicación creada. ${detail}`, 'warning')
  }

  return (
    <div className="post-detail mx-auto">
      <Card>
        <Card.Body className="p-4">
          <h1 className="h3 mb-1">Nueva publicación</h1>
          <p className="text-secondary">Escribí lo que quieras. Nadie te va a pedir explicaciones.</p>

          {serverError && <Alert variant="danger">{serverError}</Alert>}

          <Form noValidate onSubmit={handleSubmit}>
            <fieldset disabled={retryMode}>
              <Form.Group className="mb-4" controlId="newpost-description">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value)
                    setDescriptionError('')
                  }}
                  isInvalid={!!descriptionError}
                  placeholder="¿Qué querés contar?"
                />
                <Form.Control.Feedback type="invalid">{descriptionError}</Form.Control.Feedback>
              </Form.Group>

              <div className="mb-4" role="group" aria-labelledby="newpost-images-label">
                <div id="newpost-images-label" className="form-label">
                  Imágenes <span className="text-secondary">(opcional)</span>
                </div>
                {urls.map((url, i) => (
                  <InputGroup key={i} hasValidation className="mb-2">
                    <Form.Control
                      type="url"
                      value={url}
                      onChange={(e) => updateUrl(i, e.target.value)}
                      isInvalid={!!urlErrors[i]}
                      placeholder="https://ejemplo.com/foto.jpg"
                      aria-label={`URL de la imagen ${i + 1}`}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => removeUrl(i)}
                      aria-label={`Quitar la imagen ${i + 1}`}
                    >
                      <i className="bi bi-x-lg" />
                    </Button>
                    <Form.Control.Feedback type="invalid">{urlErrors[i]}</Form.Control.Feedback>
                  </InputGroup>
                ))}
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setUrls((prev) => [...prev, ''])}
                >
                  <i className="bi bi-plus-lg me-1" />
                  Agregar otra imagen
                </Button>
              </div>

              <div className="mb-4" role="group" aria-labelledby="newpost-tags-label">
                <div id="newpost-tags-label" className="form-label">
                  Etiquetas <span className="text-secondary">(opcional)</span>
                </div>
                {tagsLoading && <LoadingSpinner />}
                {tagsError && (
                  <Alert variant="warning" className="mb-0">
                    {tagsError}. Podés publicar igual, sin etiquetas.
                  </Alert>
                )}
                {!tagsLoading && !tagsError && tags.length === 0 && (
                  <p className="text-secondary small mb-0">Todavía no hay etiquetas disponibles.</p>
                )}
                <div className="d-flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <TagChip
                      key={tag.id}
                      label={`#${tag.name}`}
                      active={selectedTags.includes(tag.id)}
                      onClick={() => toggleTag(tag.id)}
                    />
                  ))}
                </div>
              </div>
            </fieldset>

            {retryMode ? (
              <Alert variant="warning" className="mb-0">
                <p className="mb-2">
                  {failedUrls.length === 1
                    ? 'Tu publicación se creó, pero 1 imagen no se pudo subir:'
                    : `Tu publicación se creó, pero ${failedUrls.length} imágenes no se pudieron subir:`}
                </p>
                <ul className="small text-break">
                  {failedUrls.map((url) => (
                    <li key={url}>{url}</li>
                  ))}
                </ul>
                <div className="d-flex flex-wrap gap-2">
                  <Button onClick={handleRetry} disabled={retrying}>
                    {retrying ? 'Reintentando…' : 'Reintentar imágenes'}
                  </Button>
                  <Button variant="outline-secondary" onClick={handleSkip} disabled={retrying}>
                    Seguir sin ellas
                  </Button>
                </div>
              </Alert>
            ) : (
              <div className="d-flex justify-content-end gap-2">
                <Link to="/" className="btn btn-outline-secondary">
                  Cancelar
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Publicando…' : 'Publicar'}
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}
