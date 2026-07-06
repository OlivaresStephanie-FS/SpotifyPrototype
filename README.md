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

### In Progress

- Backend API development
- JWT refresh implementation

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

| Method | Endpoint       | Description                            |
| :----: | -------------- | -------------------------------------- |
|  GET   | `/`            | Health check                           |
|  GET   | `/login`       | Redirect user to Spotify authorization |
|  GET   | `/callback`    | Spotify OAuth callback                 |
|  GET   | `/auth/status` | Returns current authentication status  |

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
- Implement JWT refresh functionality
- Create middleware or a route to validate the current JWT stored in MongoDB
- Return a boolean indicating whether the user must authenticate again

### Week 4 — Frontend Application

- Create a login screen for Spotify authorization
- Enforce login when no valid JWT exists
- Implement the frontend according to the approved project designs
- Complete the Spotify music search application

## Author

**Stephanie Olivares**

Full Stack Web Developer

SOLINYC LLC
