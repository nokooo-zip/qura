# QURA Backend

Express + MongoDB API for the QR-Driven Micro-Website Builder.

## Setup

### 1. MongoDB

**Option A — Local MongoDB**

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod
```

`.env` already points at `mongodb://127.0.0.1:27017/qura`.

**Option B — MongoDB Atlas (free, cloud)**

1. Sign up at https://cloud.mongodb.com  
2. Create a free cluster  
3. Database Access → add a user  
4. Network Access → allow `0.0.0.0/0` (or your IP)  
5. Connect → Drivers → copy the URI  
6. Put it in `.env` as `MONGO_URI=...` (database name `qura`)

### 2. Install & run

```bash
cd backend
npm install
cp .env.example .env   # if needed, then edit MONGO_URI
npm run seed           # demo admin + sample clients
npm run dev            # http://localhost:8000
```

### Demo login

- Email: `admin@qura.app`
- Password: `admin123`

## API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/register` | no | Create admin account |
| POST | `/api/login` | no | Login → JWT |
| GET | `/api/clients` | yes | List clients |
| GET | `/api/clients/:id` | yes | Client detail |
| POST | `/api/clients` | yes | Create client |
| PUT | `/api/clients/:id` | yes | Update client |
| DELETE | `/api/clients/:id` | yes | Delete client |
| GET | `/api/clients/:id/qr` | yes | QR data-URL for public profile |
| GET | `/api/public/:slug` | no | Public micro-site JSON |

Auth header: `Authorization: Bearer <token>`
# QURA
