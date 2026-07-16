# 🎵 Soli Music Search

A full-stack music search application built with React, Express, MongoDB, Docker, and the Spotify Web API.

This project is being developed as part of Full Sail University's Advanced Server Side Languages course using an Agile workflow throughout the duration of the project.

Users authenticate with Spotify using OAuth 2.0 to securely access personalized profile, top artists, and top tracks through the Spotify Web API.

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

#### Week 3

- 🔒 Spotify OAuth authentication
- MongoDB token persistence
- 🔄 Automatic access-token refresh
- Authentication status endpoint
- 🎧 Spotify profile endpoint
- 🎧 Spotify top artists endpoint
- 🎧 Spotify top tracks endpoint
- Required OAuth scopes (`user-top-read`)
- ✅ Live endpoint validation completed

#### Week 4

- React frontend application
- 🔒 Protected authentication flow
- 🎧 Spotify Profile page
- 🎧 Top Artists page
- 🎧 Top Tracks page
- Shared application layout
- SOLINYC-inspired responsive UI
- Responsive navigation
- Shared loading, error, and empty state components
- Profile dashboard previews
- ✅ Frontend validation completed

### ⏳ Planned

- 🎧 Spotify search endpoints
- Artist search
- Album search
- Track search

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
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
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

Week 3 delivers a personalized Spotify dashboard backend: OAuth authentication, MongoDB token persistence with automatic access-token refresh, authentication status validation, and live Web API routes that return successful Spotify responses.

Key features implemented:

- 🔒 Spotify OAuth authentication with required scopes (`user-read-private`, `user-read-email`, `user-top-read`)
- MongoDB access and refresh token persistence
- 🔄 Automatic access-token refresh via a shared token service
- Authentication status endpoint (`GET /auth/status`)
- 🎧 Current user profile (`GET /api/spotify/profile`)
- 🎧 Top artists (`GET /api/spotify/top-artists`)
- 🎧 Top tracks (`GET /api/spotify/top-tracks`)
- ✅ Live endpoint validation against the Spotify Web API

## 🎵 Week 4 — React Frontend & Spotify Dashboard

Week 4 delivers a React and Vite frontend for the personalized Spotify dashboard. Protected routing connects the existing Spotify authentication flow to responsive Profile, Top Artists, and Top Tracks pages within a shared application layout.

Key features implemented:

- React + Vite frontend application
- 🔒 Protected routing for authenticated dashboard pages
- 🎧 Spotify Profile page
- 🎧 Top Artists page
- 🎧 Top Tracks page
- Profile dashboard previews for top artists and top tracks
- SOLINYC-inspired responsive theme
- Shared loading, error, and empty states
- 🐳 Integration with the existing Docker development environment
- ✅ Frontend production build validation

## 📌 Agile Workflow

Development is managed using:

- GitHub Issues
- GitHub Milestones
- GitHub Projects
- Feature branches

Each weekly assignment is developed in its own feature branch before being merged into the `development` branch.

## 🚀 Next Steps

- 🎧 Spotify search
- Favorites
- Playlists
- Recently Played
- Listening insights
- Music player integration

## 👩‍💻 Author

**Stephanie Olivares**

Full Stack Web Developer

SOLINYC LLC
