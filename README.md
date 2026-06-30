# Spotify Prototype

Spotify Prototype is a full-stack MERN (MongoDB, Express.js, React, and Node.js) application being developed for the Project & Portfolio III course at Full Sail University.

The purpose of this project is to build a Spotify-powered music search application while following professional Agile software development practices. Development is managed using GitHub Issues, Milestones, feature branches, and weekly SCRUM progress updates.

## Project Overview

Spotify Prototype will integrate with the Spotify Web API to provide a modern music search experience based on the instructor-provided application design.

When complete, the application will allow users to:

- Authenticate with Spotify
- Search for artists, albums, and tracks
- View search results in a responsive user interface
- Open artists, albums, and tracks directly in Spotify
- Securely manage application credentials using environment variables
- Utilize a decoupled React frontend and Express backend

This repository documents the project's development from initial setup through final implementation.

## Prerequisites

The following software is required to work with this project:

- Docker Desktop
- Docker Compose
- Git
- Visual Studio Code
- GitHub account
- Spotify Developer account

## Getting Started

1. Clone the repository.

   ```bash
   git clone https://github.com/OlivaresStephanie-FS/SpotifyPrototype.git
   ```

2. Navigate to the project directory.

   ```bash
   cd SpotifyPrototype
   ```

3. Start the Docker development environment.

   ```bash
   docker compose up
   ```

4. Open the backend API in your browser.

   ```text
   http://localhost:3000
   ```

Additional setup instructions will be added as new project components are implemented throughout the course.

## Current Project Status

### Week 1 – Project Setup

Current progress includes:

- Public GitHub repository created
- Git branching strategy established
- Docker development environment configured
- Express backend initialized
- Environment variable configuration
- GitHub Milestones, Issues, and Labels configured
- Initial project documentation completed

Future milestones will implement Spotify authentication, frontend development, and additional application functionality.

## Environment Variables

Application secrets and configuration values are stored in a `.env` file.

Sensitive information such as Spotify API credentials are never committed to the repository. Environment-specific values are loaded from the `.env` file, which is excluded from version control through `.gitignore`.

## Agile Workflow

Development for this project follows an Agile workflow using GitHub.

Project management includes:

- GitHub Milestones
- GitHub Issues
- Feature branch development
- Pull Requests
- Weekly SCRUM progress updates

## Links

- **GitHub Repository:** <https://github.com/OlivaresStephanie-FS/SpotifyPrototype>
- **Local Backend API:** <http://localhost:3000>

## License

This project was created for educational purposes as part of the Full Sail University Bachelor of Science in Web Development program.