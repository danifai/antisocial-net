# UnaHur Anti-Social Net

Frontend de una red social "antisocial" donde nadie te pide que seas sociable: sin likes, sin seguidores, sin presión. Trabajo Práctico 2 de **Construcción de Interfaces de Usuario** (Universidad Nacional de Hurlingham).

Permite registrarse, iniciar sesión (simulado), navegar publicaciones, comentar y crear posts con imágenes y etiquetas. Consume la API REST de la cátedra; el contenido sale siempre de ahí.

## Integrantes
- Daniel Faigenboim
- Roxana Stephanie Rodriguez
- Marcos Espinosa

## Funcionalidades
- **Login simulado:** `nickName` + contraseña fija `123456`. Se busca el usuario con `GET /users`, la contraseña se valida en el cliente y la sesión queda en un contexto global (`useContext`) y en `localStorage`.
- **Registro:** formulario con validación previa. Si el servidor devuelve un error (por ejemplo, nickName repetido), se muestra su mensaje.
- **Inicio (`/`):** sin sesión es una portada con slogan, publicaciones reales y el login; con sesión es el feed de publicaciones recientes (descripción, imágenes, etiquetas, cantidad de comentarios y "Ver más"), con filtro por etiquetas y paginación.
- **Detalle (`/post/:id`):** descripción completa, imágenes, etiquetas, comentarios visibles y formulario para comentar.
- **Perfil (`/perfil`, protegida):** nickName, publicaciones propias (descripción, cantidad de comentarios y "Ver más") y botón para cerrar sesión.
- **Nueva publicación (`/nuevo-post`, protegida):** descripción obligatoria, una o más URLs de imágenes (opcionales) y etiquetas traídas de la API. Si alguna imagen no se puede asociar, se ofrece reintentar solo esas imágenes.

| Ruta | Acceso |
|---|---|
| `/` | Pública (portada o feed según haya sesión) |
| `/post/:id` | Pública |
| `/registro` | Pública |
| `/perfil` | Requiere sesión |
| `/nuevo-post` | Requiere sesión |

## Tecnologías
React 19 · TypeScript · Vite · React Router v6 · React Bootstrap / Bootstrap 5 · `fetch` · `useContext` (sesión) · `localStorage`

## API utilizada
Backend provisto por la cátedra: <https://github.com/lucasfigarola/backend-api>

URL de la API: **`http://localhost:3001`** (se corre en local; se puede cambiar con la variable `VITE_API_URL`, ver `.env.example`).

## Cómo correr en local
Requisitos: Node.js 20 (`nvm use` toma la versión de `.nvmrc`).

### 1. Backend (en una carpeta aparte)
```bash
git clone https://github.com/lucasfigarola/backend-api.git
cd backend-api
npm install
node seed.js   # crea la base con datos de ejemplo (⚠️ borra los datos existentes)
npm start      # http://localhost:3001
```

### 2. Frontend
```bash
git clone https://github.com/danifai/antisocial-net.git
cd antisocial-net
npm install
npm run dev    # http://localhost:5173
```

### Datos de demostración (opcional)
Con el backend corriendo, agrega usuarios, posts, imágenes y comentarios de ejemplo a través de la API (se puede ejecutar más de una vez sin duplicar):
```bash
npm run seed:demo
```

### Otros comandos
```bash
npm run lint    # análisis estático
npm run build   # chequeo de tipos + build de producción
```

## Login simulado
Se ingresa con un `nickName` existente y la contraseña fija **`123456`**. Usuarios de ejemplo del seed: `luna` y `sol`. También se puede crear una cuenta nueva desde **Registrarme**.

## Cómo probar una publicación con imágenes
En **Nueva publicación** pegá URLs que empiecen con `http://` o `https://`, por ejemplo `https://picsum.photos/seed/uno/800/500` (cambiando la palabra después de `seed/` sale otra foto). Al publicar se redirige al perfil con un aviso de confirmación.

## Notas sobre la API
- Al crear un post se envía `tagIds` (la API ignora `tags`).
- La API no devuelve cantidad de comentarios: se calcula con la lista de comentarios visibles de cada post.
- `node seed.js` recrea la base: no correrlo si hay datos que se quieran conservar.
