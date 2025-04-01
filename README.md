# Event Locator Backend

## Project Overview

Event Locator is a multi-user application that allows users to discover, create, and manage events based on location and preferences.

## Features

- User Registration and Authentication
- Event Creation and Management
- Location-Based Event Search
- Multilingual Support
- Event Notifications
- Geospatial Querying

## Prerequisites

- Node.js (v16+)
- PostgreSQL with PostGIS
- Redis
- npm

## Installation

1. Clone the repository

    ```bash
    git clone https://github.com/yourusername/event-locator-backend.git
    cd event-locator-backend
    ```

2. Install dependencies

    ```bash
    npm install
    ```

3. Set up environment variables

    - Copy `.env.example` to `.env`
    - Fill in your configuration details

4. Initialize Database

    ```bash
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    ```

5. Run the application

    ```bash
    npm run start:dev  # For development
    npm start          # For production
    ```

## Running Tests

```bash
npm test
```

## API Endpoints

- `/api/auth/register` - User Registration
- `/api/auth/login` - User Login
- `/api/events` - Event CRUD Operations
- `/api/events/search` - Location-Based Event Search

## Technologies Used

- Express.js
- Sequelize ORM
- PostgreSQL with PostGIS
- Redis
- JWT Authentication
- i18next for Internationalization

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.

```text
This comprehensive set of files provides a robust implementation for the Event Locator App backend. The code covers:
1. Database models
2. Authentication middleware
3. Event management controllers
4. Notification service
5. Internationalization
6. Main application setup
7. Environment configuration
8. README documentation
```
