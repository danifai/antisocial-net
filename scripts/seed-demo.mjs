// Carga datos de demostración usando la propia API (solo para desarrollo).
// Requiere el backend corriendo y sembrado (`node seed.js`), porque la API no permite crear etiquetas.
// Es idempotente: no repite usuarios ni posts que ya existan.
//
// Uso:  npm run seed:demo            (usa http://localhost:3001)
//       API_URL=http://otro-host:3001 npm run seed:demo

const API_URL = process.env.API_URL ?? 'http://localhost:3001'

const USERS = ['nube', 'luciernaga', 'marea', 'cactus', 'bruma', 'eco']

// `tags` son nombres de etiquetas existentes; `images` son semillas de picsum.photos.
const POSTS = [
  {
    user: 'nube',
    description:
      'Hoy no fui a la reunión y nadie lo notó. Mejor día del año.',
    tags: ['unahur'],
    comments: [{ user: 'sol', content: 'Te entiendo, pero yo tampoco fui.' }],
  },
  {
    user: 'luciernaga',
    description:
      'Mi plan para el finde: ninguno. Lo estoy cumpliendo a la perfección.',
    tags: ['arte'],
    images: ['sofa', 'manta'],
    comments: [
      { user: 'cactus', content: 'Plan impecable, sin fisuras.' },
      { user: 'luna', content: 'Yo me sumo desde mi casa, separados.' },
    ],
  },
  {
    user: 'marea',
    description:
      'Descubrí que si no contesto el grupo de WhatsApp durante tres días, el grupo deja de existir. Eficiente.',
    tags: [],
    comments: [],
  },
  {
    user: 'cactus',
    description:
      'Foto de mi planta, que es la única compañía que no me pide que hablemos.',
    tags: ['arte'],
    images: ['planta'],
    comments: [{ user: 'bruma', content: 'Hermosa. No hace falta que contestes.' }],
  },
  {
    user: 'bruma',
    description:
      'Cursando en la UnaHur y entregando los TPs sin tener que hablar con nadie. Los foros son lo más cerca que estuve de socializar.',
    tags: ['unahur'],
    images: ['cuaderno', 'cafe'],
    comments: [],
  },
  {
    user: 'eco',
    description:
      'Reflexión de las 3 AM: ningún "visto" duele más que el silencio que uno mismo eligió.',
    tags: ['arte', 'unahur'],
    comments: [
      { user: 'luna', content: 'Anotado en mi cuaderno de frases.' },
      { user: 'nube', content: 'Profundo para ser las 3 AM.' },
      { user: 'sol', content: 'Y yo que pensaba que era la única despierta.' },
    ],
  },
  {
    user: 'sol',
    description:
      'Una vez alguien me dijo "hay que juntarse". Todavía estoy esperando que se olvide.',
    tags: [],
    images: ['ventana'],
    comments: [{ user: 'marea', content: 'Con suerte pasa un año entero.' }],
  },
  {
    user: 'luna',
    description:
      'Recomendación: auriculares puestos, sin música. Funciona como "no molestar" universal.',
    tags: ['unahur'],
    comments: [{ user: 'eco', content: 'Lo hago hace años.' }],
  },
]

async function api(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(`${path} -> ${res.status} ${data?.error ?? ''}`.trim())
  }
  return data
}

async function main() {
  const [users, tags, posts] = await Promise.all([
    api('/users'),
    api('/tags'),
    api('/posts'),
  ])
  if (users.length === 0) {
    throw new Error('La base está vacía: corré primero `node seed.js` en el backend.')
  }

  const userIdByName = new Map(users.map((u) => [u.nickName, u.id]))
  const tagIdByName = new Map(tags.map((t) => [t.name, t.id]))
  const existingDescriptions = new Set(posts.map((p) => p.description))

  let newUsers = 0
  for (const nickName of USERS) {
    if (userIdByName.has(nickName)) continue
    const user = await api('/users', { nickName, email: `${nickName}@example.com` })
    userIdByName.set(nickName, user.id)
    newUsers++
  }

  let newPosts = 0
  for (const p of POSTS) {
    if (existingDescriptions.has(p.description)) continue
    const userId = userIdByName.get(p.user)
    const tagIds = p.tags.map((name) => tagIdByName.get(name)).filter(Boolean)
    const post = await api('/posts', { description: p.description, userId, tagIds })

    for (const seed of p.images ?? []) {
      await api('/postimages', {
        url: `https://picsum.photos/seed/${seed}/600/400`,
        postId: post.id,
      })
    }
    for (const c of p.comments) {
      await api('/comments', {
        content: c.content,
        userId: userIdByName.get(c.user),
        postId: post.id,
      })
    }
    newPosts++
  }

  console.log(`Listo (${API_URL}): ${newUsers} usuarios y ${newPosts} posts nuevos.`)
  console.log('Usuarios de demo: contraseña 123456 para todos.')
}

main().catch((err) => {
  console.error(`No se pudo cargar la demo: ${err.message}`)
  process.exit(1)
})
