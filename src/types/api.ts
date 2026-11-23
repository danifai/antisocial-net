// Tipos que reflejan las respuestas de la API de la cátedra.
// Las claves vienen en PascalCase desde Sequelize (UserId, User, Tags...): no se remapean.

export interface User {
  id: number
  nickName: string
  email: string
  createdAt: string
}

export interface Tag {
  id: number
  name: string
}

export interface Post {
  id: number
  description: string
  createdAt: string
  UserId: number
  User?: User // no viene en la respuesta de POST /posts
  Tags?: Tag[]
}

export interface Comment {
  id: number
  content: string
  createdAt: string
  UserId: number
  PostId: number
  User?: User // no viene en la respuesta de POST /comments
}

export interface PostImage {
  id: number
  url: string
  PostId: number
}

export interface NewUser {
  nickName: string
  email: string
}

export interface NewPost {
  description: string
  userId: number
  tagIds?: number[]
}

export interface NewComment {
  content: string
  userId: number
  postId: number
}

export interface NewPostImage {
  url: string
  postId: number
}
