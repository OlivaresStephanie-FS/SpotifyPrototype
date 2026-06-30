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

- Node.js (version 20 or later recommended)
- npm
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
    cd pp3-spotify-app
    ```

3. Install project dependencies after the application has been initialized.

    ```bash
    npm install
    ```

4. Create a `.env` file when configuring the backend application.

Additional setup instructions will be added as new project components are implemented throughout the course.

## Current Project Status

### Week 1 – Project Setup

Current progress includes:

- Project repository initialization
- GitHub repository creation
- Git branching strategy
- Agile milestone setup
- Initial project documentation

Project functionality will be implemented during future weekly milestones.

## Environment Variables

Application secrets and configuration values will be stored in a `.env` file.

Sensitive information such as Spotify API credentials will never be committed to the repository. Environment-specific values will be loaded from the `.env` file, which is excluded from version control through `.gitignore`.

## Agile Workflow

Development for this project follows an Agile workflow using GitHub.

Project management includes:

- GitHub Milestones
- GitHub Issues
- Feature branch development
- Weekly SCRUM progress updates

## Links

- **GitHub Repository:** <https://github.com/OlivaresStephanie-FS/SpotifyPrototype>

## License

This project was created for educational purposes as part of the Full Sail University Bachelor of Science in Web Development program.
