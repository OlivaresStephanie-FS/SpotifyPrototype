# 🎵 Soli Music Search

A full-stack music search application built with React, Express, MongoDB, Docker, and the Spotify Web API.

This project is being developed as part of Full Sail University's Advanced Server Side Languages course using an Agile workflow throughout the duration of the project.

Users authenticate with Spotify using OAuth 2.0 to securely access their profile, followed artists, and Liked Songs (saved tracks) through the Spotify Web API.

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
- 🎧 Spotify followed artists endpoint
- 🎧 Spotify saved tracks endpoint
- Required OAuth scopes (`user-follow-read`, `user-library-read`)
- ✅ Live endpoint validation completed

#### Week 4

- React frontend application
- 🔒 Protected authentication flow
- 🎧 Spotify Profile page
- 🎧 Followed Artists page
- 🎧 Liked Songs page
- Shared application layout
- SOLINYC-inspired responsive UI
- Responsive navigation
- Shared loading, error, and empty state components
- Profile dashboard previews
- ✅ Frontend validation completed

#### Final Assignment Correction

- 🎧 Spotify search endpoint (`GET /api/spotify/search`)
- Artist search
- Album search
- Track search
- 🔒 Protected `/search` route
- Authenticated redirect to `/search` after login
- Authenticated `/login` redirect to `/search`
- Visible **No results** state before search and for zero matches
- Clickable result thumbnails using Spotify Web Player links (`external_urls.spotify`)

### ⏳ Planned

- Favorites
- Playlists
- Recently Played
- Listening insights
- Music player integration

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
|  GET   | `/api/spotify/profile`          | Current Spotify user profile           |
|  GET   | `/api/spotify/followed-artists` | Artists the current user follows       |
|  GET   | `/api/spotify/saved-tracks`     | Tracks saved in the user's library     |

## 🎧 Week 3 — Personalized Spotify Dashboard API

Week 3 delivers a personalized Spotify dashboard backend: OAuth authentication, MongoDB token persistence with automatic access-token refresh, authentication status validation, and live Web API routes that return successful Spotify responses.

Key features implemented:

- 🔒 Spotify OAuth authentication with required scopes (`user-read-private`, `user-read-email`, `user-follow-read`, `user-library-read`)
- MongoDB access and refresh token persistence
- 🔄 Automatic access-token refresh via a shared token service
- Authentication status endpoint (`GET /auth/status`)
- 🎧 Current user profile (`GET /api/spotify/profile`)
- 🎧 Followed artists (`GET /api/spotify/followed-artists`)
- 🎧 Saved tracks (`GET /api/spotify/saved-tracks`)
- ✅ Live endpoint validation against the Spotify Web API

## 🎵 Week 4 — React Frontend & Spotify Dashboard

Week 4 delivers a React and Vite frontend for the personalized Spotify dashboard. Protected routing connects the existing Spotify authentication flow to responsive Profile, Followed Artists, and Liked Songs pages within a shared application layout.

Key features implemented:

- React + Vite frontend application
- 🔒 Protected routing for authenticated dashboard pages
- 🎧 Spotify Profile page
- 🎧 Followed Artists page
- 🎧 Liked Songs page backed by Spotify's Saved Tracks endpoint
- Profile dashboard previews for followed artists and liked songs
- SOLINYC-inspired responsive theme
- Shared loading, error, and empty states
- 🐳 Integration with the existing Docker development environment
- ✅ Frontend production build validation

## 🎯 Portfolio Improvement

The application originally displayed Spotify's Top Artists and Top Tracks using Spotify's affinity endpoints. During portfolio validation, these endpoints frequently returned empty results for newer Spotify accounts because Spotify only generates affinity data after sufficient listening history.

To improve the user experience while still demonstrating authenticated Spotify Web API integration, the application now uses:

- Followed Artists
- Liked Songs (Spotify Saved Tracks)

These endpoints provide real user-library data as soon as a user follows artists or saves tracks. This produces a more representative portfolio demonstration for both new and established Spotify users.

### Engineering rationale

The objective of the project is to demonstrate:

- OAuth authentication
- Protected routes
- Authenticated Spotify Web API requests
- Personalized user-data rendering
- A responsive React UI
- Loading and error-state handling

Followed Artists and Liked Songs satisfy all of these project objectives while providing meaningful data without depending on Spotify affinity-history generation.

### Technical changes

The OAuth scope requirements changed from:

```text
user-top-read
```

to:

```text
user-follow-read
user-library-read
```

The existing profile scopes remain in place:

```text
user-read-private
user-read-email
```

Additional implementation changes:

- Top Artists was replaced with Followed Artists.
- Top Tracks was replaced with Liked Songs.
- Profile dashboard previews now display followed artists and liked songs.
- Navigation labels were updated to match the new features.
- The `/saved-tracks` frontend route intentionally remains unchanged because it maps directly to Spotify's Saved Tracks API endpoint, while the interface uses Spotify's consumer-facing term **Liked Songs**.

### Additional UI improvements

- Artist follower counts are read from `artist.followers.total`.
- Large follower counts use compact formatting such as `1.2M` and `842K`.
- Up to three genres are displayed from `artist.genres` when available.
- Graceful fallback text is shown when Spotify omits optional follower or genre data.

### Validation

The application was re-authorized with `user-follow-read` and `user-library-read` and verified against a real Spotify account. Followed Artists, Liked Songs, profile dashboard previews, navigation, authenticated API access, loading states, and error handling were validated with live user-library data.

## 🔍 Spotify Search

The final assignment correction adds authenticated Spotify Search while preserving the existing SOLINYC branding and portfolio library pages (Profile, Followed Artists, Liked Songs).

### Backend

- Authenticated endpoint: `GET /api/spotify/search?q=&type=`
- Supported types: `artist`, `album`, `track`
- Reuses the existing Spotify token persistence and refresh service
- Spotify access and refresh tokens remain server-side only
- Results are normalized to include `id`, `name`, `type`, `image`, `subtitle`, and `external_urls.spotify`

### Frontend

- Protected route: `/search`
- Search input, type selector, search button, loading state, error state, and results list
- Search navigation item added to the existing header
- Visible **No results** message before any search and when Spotify returns zero matches
- Every result thumbnail links to Spotify Web Player via `external_urls.spotify` (`target="_blank"`, `rel="noopener noreferrer"`)

### Authentication redirects

- Successful OAuth callback redirects to `/search`
- Authenticated visits to `/login` redirect to `/search`
- Existing Spotify token persistence is unchanged (no application JWT)

## 📌 Agile Workflow

Development is managed using:

- GitHub Issues
- GitHub Milestones
- GitHub Projects
- Feature branches

Each weekly assignment is developed in its own feature branch before being merged into the `development` branch.

## 🚀 Next Steps

- Favorites
- Playlists
- Recently Played
- Listening insights
- Music player integration

## 👩‍💻 Author

**Stephanie Olivares**

Full Stack Web Developer

SOLINYC LLC
