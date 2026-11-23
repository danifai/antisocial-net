import type {
  Comment,
  NewComment,
  NewPost,
  NewPostImage,
  NewUser,
  Post,
  PostImage,
  Tag,
  User,
} from '../types/api'

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, init)
  } catch {
    throw new Error(
      `No se pudo conectar con la API. Verificá que esté corriendo en ${API_URL}`,
    )
  }

  const data: unknown = await res.json().catch(() => null)
  if (!res.ok) {
    // La API devuelve { error } con el mensaje para mostrar al usuario.
    const message = (data as { error?: string } | null)?.error
    throw new Error(message ?? `Error ${res.status} al consultar la API`)
  }
  return data as T
}

const get = <T>(path: string) => request<T>(path)

const post = <T>(path: string, body: unknown) =>
  request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

/** Mensaje legible para mostrar en un Alert a partir de cualquier error capturado. */
export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Ocurrió un error inesperado'
}

// Usuarios
export const getUsers = () => get<User[]>('/users')
export const getUser = (id: number) => get<User>(`/users/${id}`)
export const createUser = (data: NewUser) => post<User>('/users', data)

// Posts
export const getPosts = (userId?: number) =>
  get<Post[]>(userId === undefined ? '/posts' : `/posts?userId=${userId}`)
export const getPost = (id: number) => get<Post>(`/posts/${id}`)
// OJO: la API lee `tagIds` (el PDF dice `tags`, pero con ese nombre guarda el post sin etiquetas).
export const createPost = (data: NewPost) => post<Post>('/posts', data)

// Etiquetas
export const getTags = () => get<Tag[]>('/tags')

// Comentarios (la API ya devuelve solo los visibles)
export const getComments = (postId: number) =>
  get<Comment[]>(`/comments/post/${postId}`)
export const createComment = (data: NewComment) =>
  post<Comment>('/comments', data)

// Imágenes de posts
export const getPostImages = (postId: number) =>
  get<PostImage[]>(`/postimages/post/${postId}`)
export const createPostImage = (data: NewPostImage) =>
  post<PostImage>('/postimages', data)
