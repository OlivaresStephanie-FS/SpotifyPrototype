# 🎵 Soli Music Search

A full-stack music search application built with React, Express, MongoDB, Docker, and the Spotify Web API.

This project is being developed as part of Full Sail University's Advanced Server Side Languages course using an Agile workflow throughout the duration of the project.

## ✨ Features

### ✅ Completed

#### Week 1

- Express backend
- 🐳 Docker development environment
- Environment variable configuration
- Project documentation
- GitHub Issues
- GitHub Milestones
- GitHub Project board

#### Week 2

- 🎧 Spotify Developer application
- 🔒 Spotify OAuth Authorization Code Flow
- Spotify login endpoint
- Spotify callback endpoint
- MongoDB token persistence
- Authentication status endpoint

### 🚧 In Progress

#### Week 3

Week 3 backend work is in progress. The following items are implemented:

- 🔒 Spotify OAuth authentication
- MongoDB token persistence
- Automatic access-token refresh
- Authentication status endpoint
- Personalized Spotify API routes
- Required OAuth scopes for personalized endpoints (`user-top-read`)

Week 3 is not marked complete until GitHub Issue #17 is resolved and live Spotify resource responses succeed for this developer app.

### ⏳ Planned

- Spotify search endpoints
- React frontend
- Login interface
- Artist search
- Album search
- Track search
- Responsive user interface

## 🛠️ Technology Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

### Frontend

- React
- Vite

### 🔒 Authentication

- 🎧 Spotify OAuth 2.0 Authorization Code Flow

### Infrastructure

- 🐳 Docker
- Docker Compose

### Development

- Git
- GitHub
- GitHub Issues
- GitHub Milestones
- GitHub Projects

## 📁 Project Structure

```text
pp3-spotify-app/
│
├── backend/
│   ├── config/
│   ├── models/
│   ├── services/
│   ├── index.js
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

## 🚀 Running the Project

Clone the repository:

```bash
git clone https://github.com/OlivaresStephanie-FS/SpotifyPrototype.git
```

Start the development environment:

```bash
docker compose up
```

Open your browser:

```text
http://localhost:3000
```

## 🔑 Environment Variables

Create a `.env` file inside the `backend` directory.

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
MONGODB_URI=
PORT=3000
NODE_ENV=development
```

## 🔐 Authentication Flow

1. User navigates to `/login`.
2. User is redirected to Spotify's authorization page.
3. User authorizes the application.
4. Spotify redirects the user to `/callback`.
5. The backend exchanges the authorization code for an access token and refresh token.
6. Tokens are stored in MongoDB.
7. Authentication status can be checked using `/auth/status`.

## 📡 Current API Endpoints

| Method | Endpoint                    | Description                            |
| :----: | --------------------------- | -------------------------------------- |
|  GET   | `/`                         | Health check                           |
|  GET   | `/login`                    | Redirect user to Spotify authorization |
|  GET   | `/callback`                 | Spotify OAuth callback                 |
|  GET   | `/auth/status`              | Returns current authentication status  |
|  GET   | `/api/spotify/profile`      | Current Spotify user profile           |
|  GET   | `/api/spotify/top-artists`  | Current user's top artists             |
|  GET   | `/api/spotify/top-tracks`   | Current user's top tracks              |

## 🎧 Week 3 — Personalized Spotify Dashboard API

Week 3 adds three backend routes that call the Spotify Web API using a stored OAuth access token:

- `GET /api/spotify/profile`
- `GET /api/spotify/top-artists`
- `GET /api/spotify/top-tracks`

Login requests the `user-top-read` scope in addition to `user-read-private` and `user-read-email`, which is required for the top artists and top tracks endpoints.

OAuth login, MongoDB token persistence, access-token refresh, authentication status validation, and dashboard route integration are implemented. Each dashboard route obtains a usable access token through the shared token service before calling Spotify.

Live Spotify profile, top-artist, and top-track payloads are currently blocked by an external Premium-status propagation issue on Spotify’s Developer Platform. See **Current External Blocker (Issue #17)** below.

This project does not substitute mock profile, artist, or track data for live Spotify responses. When Spotify blocks the request for Premium eligibility, the API returns an explicit `spotify_premium_required` error instead of fabricated music data.

## ⚠️ Current External Blocker (Issue #17)

Spotify’s February 2026 Developer Platform update requires the developer app owner to have an active Spotify Premium subscription before Web API requests are allowed.

The developer account has already been upgraded to Premium, OAuth has been re-authorized successfully, and authentication plus token refresh work correctly. Spotify is still returning HTTP 403 responses indicating the Premium status has not yet propagated.

This is an external platform issue, not an application bug. Progress is tracked in GitHub Issue #17. Week 3 will remain in progress until that issue is resolved.

## 📌 Agile Workflow

Development is managed using:

- GitHub Issues
- GitHub Milestones
- GitHub Projects
- Feature branches

Each weekly assignment is developed in its own feature branch before being merged into the `development` branch.

## 🚀 Next Steps

- Resolve Spotify Premium propagation issue (Issue #17)
- Complete Week 3 backend validation
- Build the React frontend
- Implement artist, album, and track search

## 👩‍💻 Author

**Stephanie Olivares**

Full Stack Web Developer

SOLINYC LLC
