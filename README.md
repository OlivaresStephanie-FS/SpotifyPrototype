# Soli Music Search

A full-stack music search application built with React, Express, MongoDB, Docker, and the Spotify Web API.

This project is being developed as part of Full Sail University's Advanced Server Side Languages course using an Agile workflow throughout the duration of the project.

## Features

### Completed

#### Week 1

- Express backend
- Docker development environment
- Environment variable configuration
- Project documentation
- GitHub Issues
- GitHub Milestones
- GitHub Project board

#### Week 2

- Spotify Developer application
- Spotify OAuth Authorization Code Flow
- Spotify login endpoint
- Spotify callback endpoint
- MongoDB token persistence
- Authentication status endpoint

#### Week 3

- Reusable Spotify access-token refresh
- Authentication status validation with refresh support
- Personalized Spotify dashboard API routes
- `user-top-read` OAuth scope

### In Progress

- Frontend application preparation

### Planned

- Spotify search endpoints
- React frontend
- Login interface
- Artist search
- Album search
- Track search
- Responsive user interface

## Technology Stack

### Backend

- Node.js
- Express
- MongoDB
- Mongoose

### Frontend

- React
- Vite

### Authentication

- Spotify OAuth 2.0 Authorization Code Flow

### Infrastructure

- Docker
- Docker Compose

### Development

- Git
- GitHub
- GitHub Issues
- GitHub Milestones
- GitHub Projects

## Project Structure

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

## Running the Project

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

## Environment Variables

Create a `.env` file inside the `backend` directory.

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REDIRECT_URI=
MONGODB_URI=
PORT=3000
NODE_ENV=development
```

## Authentication Flow

1. User navigates to `/login`.
2. User is redirected to Spotify's authorization page.
3. User authorizes the application.
4. Spotify redirects the user to `/callback`.
5. The backend exchanges the authorization code for an access token and refresh token.
6. Tokens are stored in MongoDB.
7. Authentication status can be checked using `/auth/status`.

## Current API Endpoints

| Method | Endpoint                    | Description                            |
| :----: | --------------------------- | -------------------------------------- |
|  GET   | `/`                         | Health check                           |
|  GET   | `/login`                    | Redirect user to Spotify authorization |
|  GET   | `/callback`                 | Spotify OAuth callback                 |
|  GET   | `/auth/status`              | Returns current authentication status  |
|  GET   | `/api/spotify/profile`      | Current Spotify user profile           |
|  GET   | `/api/spotify/top-artists`  | Current user's top artists             |
|  GET   | `/api/spotify/top-tracks`   | Current user's top tracks              |

## Week 3 — Personalized Spotify Dashboard API

Week 3 added three backend routes that call the Spotify Web API using a stored OAuth access token:

- `GET /api/spotify/profile`
- `GET /api/spotify/top-artists`
- `GET /api/spotify/top-tracks`

Login now requests the `user-top-read` scope in addition to `user-read-private` and `user-read-email`, which is required for the top artists and top tracks endpoints.

OAuth login, MongoDB token persistence, access-token refresh, authentication status validation, and dashboard route integration are implemented. Each dashboard route obtains a usable access token through the shared token service before calling Spotify.

During testing, Spotify returned HTTP 403 with a platform restriction: the developer app owner must have an active Premium subscription before Web API resource requests are allowed. Because of that restriction, live Spotify profile, top-artist, and top-track payloads are not currently returned for this developer app.

This project does not substitute mock profile, artist, or track data for live Spotify responses. When Spotify blocks the request for Premium eligibility, the API returns an explicit `spotify_premium_required` error instead of fabricated music data.

## Agile Workflow

Development is managed using:

- GitHub Issues
- GitHub Milestones
- GitHub Projects
- Feature branches

Each weekly assignment is developed in its own feature branch before being merged into the `development` branch.

## Roadmap

### Week 1 — Project Setup

- Initialize project repository
- Create project documentation
- Configure Agile workflow
- Initialize Express backend API
- Configure environment variables
- Configure Docker development environment

### Week 2 — Spotify Authentication

- Create Spotify Developer application
- Configure Spotify environment variables
- Implement Spotify login route
- Implement Spotify callback route
- Configure MongoDB JWT persistence
- Create authentication status endpoint

### Week 3 — Backend API & Token Management

- Define custom backend API routes for the Spotify application
- Implement Spotify access-token refresh functionality
- Validate stored Spotify authentication status
- Return whether the user must authenticate again
- Document the Spotify developer-app Premium restriction affecting live Web API responses

### Week 4 — Frontend Application

- Create a login screen for Spotify authorization
- Enforce login when no valid JWT exists
- Implement the frontend according to the approved project designs
- Complete the Spotify music search application

## Author

**Stephanie Olivares**

Full Stack Web Developer

SOLINYC LLC
