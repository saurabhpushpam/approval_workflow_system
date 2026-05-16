# Approval Workflow System

This repository contains a full-stack approval workflow application with a Node.js/Express backend and a React frontend.
The application allows users to submit requests, and managers to review, approve, or reject those requests.



### Assumptions

- The backend uses MySQL DB.
- The backend defaults to port `5000`.
- The frontend development server runs on `localhost:3000`.
- The frontend API base URL is currently hardcoded in `frontend/src/services/api.js`.
- The current backend `npm start` script uses `nodemon` for development.
- For production, the backend should be run with `node server.js`.
- The backend performs database initialization in `backend/config/initDb.js`, and that script seeds default users and sample requests.



## Project Structure

- `backend/`
  - `server.js` — Entry point for the Express backend
  - `config/db.js` — MySQL connection pool configuration
  - `config/initDb.js` — Database and table initialization script
  - `routes/` — API route definitions
  - `controllers/` — Application logic for auth and request management
  - `middleware/` — JWT authentication and role validation middleware

- `frontend/`
  - `src/` — React application source files
  - `public/` — Static HTML and public assets
  - `src/services/api.js` — Axios instance configured for backend requests



## Requirements

- Node.js v14+ (v16+ recommended)
- npm
- MySQL server
- Git (optional)



## Backend Environment Variables

The backend requires these environment variables:

- `PORT` — Backend server port (default: `5000`)
- `DB_HOST` — MySQL host name or IP address
- `DB_USER` — MySQL username
- `DB_PASSWORD` — MySQL password
- `DB_NAME` — MySQL database name
- `JWT_SECRET` — Secret key for signing JWT tokens


## Backend Setup 

1. Install backend dependencies:

cd backend
npm install


2. Create a `.env` file and set the required variables.


3. Start the server:

npm start

4. Verify the backend is running:

http://localhost:5000



## Frontend Setup 

1. Install frontend dependencies:

cd frontend
npm install

2. Start the Frontend server:

npm start

3. Open the app in the browser:

http://localhost:3000



## Database Notes

- The backend uses MySQL via the `mysql2` package.
- `backend/config/initDb.js` creates the database if it does not exist.
- The initialization script also creates tables and seeds default users and sample requests.

### Default seeded users

- Manager account:
  - Email: `manager@example.com`
  - Password: `Manager123!`
- Basic user account:
  - Email: `user@example.com`
  - Password: `User123!`



## API Endpoints

- `GET /` — Health check
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Log in and receive a JWT
- `GET /requests` — Get all requests (requires authentication)
- `POST /requests` — Create a request (requires authentication)
- `PUT /requests/:id/approve` — Approve a request (manager role required)
- `PUT /requests/:id/reject` — Reject a request (manager role required)


