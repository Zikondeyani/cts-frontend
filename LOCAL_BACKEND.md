Connect frontend to local backend

Frontend is configured via `VUE_APP_ROOT_API` in `.env-dev` or `sample.env`.

Local backend settings (example) — use these in your backend .env:

HOST=127.0.0.1
PORT=3000
# Database (PostgreSQL)
DB_CONNECTOR=postgresql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=cts_user
DB_PASSWORD=cts_password
DB_DATABASE=commodity_tracking_db
DB_USE_NEW_URL_PARSER=true
# Rate Limiter (In-Memory)
RL_COUNT=1000

Steps to run frontend against local backend:

1. Ensure your backend is running on http://127.0.0.1:3000 and connected to the PostgreSQL database using the credentials above.
2. In this repository, ensure `.env-dev` (or `sample.env`) contains:

VUE_APP_ROOT_API=http://127.0.0.1:3000
VUE_APP_MAIL_API=http://127.0.0.1:3000

3. Start the frontend dev server:

# install deps (if needed)
npm install
# run dev server
npm run serve

4. Open the app in the browser and verify API requests go to `http://127.0.0.1:3000`.

If your backend uses a different .env filename, copy the DB snippet into that backend repo's env file.