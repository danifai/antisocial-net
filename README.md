# UnaHur Anti-Social Net

Frontend de una red social "antisocial" donde nadie te pide que seas sociable: sin likes, sin seguidores, sin presión. Trabajo Práctico 2 de **Construcción de Interfaces de Usuario** (Universidad Nacional de Hurlingham).

Permite registrarse, iniciar sesión (simulado), navegar publicaciones, comentar y crear posts con imágenes y etiquetas.

## Integrantes
- Daniel Faigenboim
- Roxana Stephanie Rodriguez
- Marcos Espinosa

## Tecnologías
React 19 · TypeScript · Vite · React Router v6 · React Bootstrap / Bootstrap 5 · `fetch` · `useContext` (sesión) · `localStorage`

## API utilizada
Backend provisto por la cátedra: <https://github.com/lucasfigarola/backend-api>
URL local: **`http://localhost:3001`** (configurable con `VITE_API_URL`, ver `.env.example`).

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
