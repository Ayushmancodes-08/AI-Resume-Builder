# Deployment Manual - AI Resume Builder

This document outlines instructions for deploying the AI Resume Builder frontend (Next.js) and backend (FastAPI) applications to production.

---

## 1. Environment Variables Configuration

Ensure the following environment variables are set in your deployment environments (or inside `.env` files).

### Backend (FastAPI) Environment Variables

| Variable | Description | Recommended Production Value | Default Value |
| :--- | :--- | :--- | :--- |
| `DATABASE_URL` | SQLAlchemy connection string | `postgresql://user:password@host:5432/db` | `sqlite:///./resume_builder.db` |
| `SECRET_KEY` | Hex token key for signing JWTs | A cryptographically secure random key | `your-secret-key-for-dev...` |
| `ALGORITHM` | Encryption algorithm for JWT tokens | `HS256` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token validity timeframe | `30` | `30` |
| `ENVIRONMENT` | Environment toggle | `production` | `development` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://your-frontend.com` | `*` |

### Frontend (Next.js) Environment Variables

| Variable | Description | Production Value | Default Value |
| :--- | :--- | :--- | :--- |
| `BACKEND_API_URL` | The external/internal backend service URL | `https://your-backend-api.com` or docker service `http://backend:8000` | `http://localhost:8000` |

---

## 2. Deploying with Docker (Recommended)

The platform provides a pre-configured `docker-compose.yml` to launch the database, backend API, and frontend client.

### Quick Start
To build and run all services in containerized mode:
```bash
docker-compose up --build -d
```

This starts:
- **Database**: PostgreSQL on port `5432`
- **Backend API**: FastAPI on port `8000`
- **Frontend Client**: Next.js on port `3000`

---

## 3. Manual Server Deployment

If you are not using Docker, you can run the services manually.

### Deploying the Backend (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install production requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Perform database migration schema updates:
   ```bash
   alembic upgrade head
   ```
5. Run the production ASGI server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

### Deploying the Frontend (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm ci
   ```
3. Build the production application bundle:
   ```bash
   BACKEND_API_URL=https://your-backend-api.com npm run build
   ```
4. Start the server runner:
   ```bash
   npm run start
   ```

---

## 4. Database Migrations (Alembic)

The backend uses Alembic to manage database migrations. When deploying database updates, run:
```bash
alembic upgrade head
```
This reads your target `DATABASE_URL` environment variable and runs all pending database schema update files.

---

## 5. Deployment Platform Recommendations

- **Frontend Hosting**: [Vercel](https://vercel.com) (Best for Next.js) or Netlify. Add your environment variables in the dashboard.
- **Backend Hosting**: [Render](https://render.com), [Railway](https://railway.app), or [Fly.io]. 
- **Database**: Supabase (PostgreSQL), Render Postgres, or AWS RDS.
- **AI Models**: Connect the backend to a hosted Ollama server or refactor `ai_service.py` to point to a cloud service (e.g. OpenAI / Google Gemini API keys).
