# QURA — QR-Driven Micro-Website Builder

Small businesses get a customizable micro-website + printable QR code without coding.

```
qura/
├── backend/     Node.js + Express + MongoDB (CRUD + auth + QR)
└── frontend/    React + Vite + Tailwind (admin + public profile)
```

## Quick start

### 1. MongoDB

**Local**

```bash
# macOS
brew services start mongodb-community

# or Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

**Atlas (cloud free tier)**  
Create a cluster at [cloud.mongodb.com](https://cloud.mongodb.com), get the connection string, and put it in `backend/.env` as `MONGO_URI`.

### 2. Backend

```bash
cd backend
npm install
# edit .env if needed (default: mongodb://127.0.0.1:27017/qura)
npm run seed          # creates admin@qura.app / admin123 + sample clients
npm run dev           # http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

Open http://localhost:5173 → login with **admin@qura.app** / **admin123**.

## What works (full CRUD)

| Feature | How |
|--------|-----|
| Register / Login | JWT stored in `localStorage` |
| List clients | Admin panel table |
| Create client | “New Client” → opens editor |
| Edit profile, links, products | `/admin/client/:id` → Save |
| Delete client | Trash icon + confirm |
| Public micro-site | `/profile/:slug` (QR destination) |
| QR code | QR icon → download PNG |

## Project fixes applied to original UI

1. **Tailwind CSS** was used in class names but never installed → added Tailwind v4 via `@tailwindcss/vite`.
2. **Vite template CSS** constrained `#root` width and broke full-page layouts → replaced with clean base styles.
3. **Hardcoded mock data** → live API + MongoDB.
4. **No routing params** → `/admin/client/:id` and `/profile/:slug`.
5. **No backend** → Express API matching the pattern in your `fullstack` sample (models, controllers, auth, CORS, JWT).

## API overview

See `backend/README.md`. Auth header: `Authorization: Bearer <token>`.

## Environment

| Variable | Default | Where |
|----------|---------|--------|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/qura` | backend `.env` |
| `PORT` | `8000` | backend `.env` |
| `JWT_SECRET` | (dev string) | backend `.env` |
| `FRONTEND_URL` | `http://localhost:5173` | backend `.env` (used for QR links) |
| `VITE_API_URL` | `http://localhost:8000/api` | frontend (optional) |
# QURA
# qura
