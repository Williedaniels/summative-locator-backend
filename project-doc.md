# Event Locator Backend

## Project Overview

Event Locator is a robust multi-user application that empowers users to discover, create, and manage events based on their location and personal preferences. This backend application provides the core API and services to support the Event Locator platform.

## Key Features

* **User Management:**
  * User registration and authentication (secure password hashing).
  * User profile management (update username, language, preferences).
  * Location tracking and updates.
* **Event Management:**
  * Create, read, update, and delete (CRUD) operations for events.
  * Location-based event searching using geospatial queries.
  * Event categorization.
  * Setting maximum participant limits.
* **Notifications:**
  * Real-time event notifications.
  * Marking notifications as read.
* **Internationalization (i18n):**
  * Support for multiple languages, allowing users to interact with the application in their preferred language.
* **Authentication and Authorization:**
  * Secure JWT (JSON Web Token) based authentication.
  * Protected API endpoints.
* **Testing:**
  * Comprehensive test suite to ensure code quality and reliability.

## Technical Choices

* **Node.js:** A JavaScript runtime environment for building scalable and efficient server-side applications.
* **Express.js:** A lightweight and versatile framework for Node.js, designed to simplify the development of web and mobile applications.
* **PostgreSQL:** A powerful, open-source relational database system.
* **PostGIS:** A spatial extension for PostgreSQL that enables geospatial data storage and querying.
* **Sequelize ORM:** An Object-Relational Mapper (ORM) for Node.js that simplifies database interactions.
* **Redis:** An in-memory data structure store, used here for caching and potentially for real-time features.
* **JSON Web Tokens (JWT):** A standard for securely transmitting information between parties as a JSON object, used for authentication.
* **i18next:** A popular internationalization framework for JavaScript, used to support multiple languages.
* **Bcrypt:** A password-hashing function used to securely store user passwords.
* **Jest:** A JavaScript testing framework used to write and run tests.
* **Supertest:** A library for testing HTTP assertions.
* **Dotenv:** A library to load environment variables from a `.env` file.
* **Dotenv-cli:** A library to load environment variables from a `.env` file in the command line.
* **Amqplib:** A library to use RabbitMQ.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js (v16+):** https://nodejs.org/
* **PostgreSQL:** https://www.postgresql.org/
* **PostGIS Extension:** https://postgis.net/
* **Redis:** https://redis.io/
* **npm (Node Package Manager):** Usually comes with Node.js.

## Installation and Setup

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/yourusername/event-locator-backend.git
    cd event-locator-backend
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Database Setup:**

    * **Create Databases:**
        * Create three PostgreSQL databases: `summative_dev`, `summative_test`, and `summative_prod`.

        ```bash
        createdb summative_dev
        createdb summative_test
        createdb summative_prod
        ```

    * **Enable PostGIS:**
        * Connect to each database using `psql` and enable the PostGIS extension:

        ```bash
        psql -d summative_dev -c "CREATE EXTENSION postgis;"
        psql -d summative_test -c "CREATE EXTENSION postgis;"
        psql -d summative_prod -c "CREATE EXTENSION postgis;"
        ```

4. **Environment Variables:**

    * Copy the `.env.example` file to `.env`:

        ```bash
        cp .env.example .env
        ```

    * Edit the `.env` file and fill in your database credentials, Redis connection details, and other configurations.
    * Create a `.env.test` file for the test environment.

        ```bash
        cp .env.example .env.test
        ```

    * Edit the `.env.test` file and fill in your database credentials, Redis connection details, and other configurations.
    * **Example `.env` content:**

        ```text
        DB_USER=your_db_username
        DB_PASSWORD=your_db_password
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME_DEV=summative_dev
        DB_NAME_TEST=summative_test
        DB_NAME_PROD=summative_prod
        REDIS_HOST=localhost
        REDIS_PORT=6379
        SECRET_KEY=your_secret_key
        ```

    * **Example `.env.test` content:**

        ```test
        DB_USER=your_db_username
        DB_PASSWORD=your_db_password
        DB_HOST=localhost
        DB_PORT=5432
        DB_NAME_DEV=summative_dev
        DB_NAME_TEST=summative_test
        DB_NAME_PROD=summative_prod
        REDIS_HOST=localhost
        REDIS_PORT=6379
        SECRET_KEY=your_secret_key_for_testing
        ```

5. **Database Migrations:**

    * Run the Sequelize migrations to create the database tables:

        ```bash
        npx sequelize-cli db:migrate
        ```

6. **Configuration File**
    * Create a `config` directory in the root of your project if it doesn't exist.
    * Create a `config.json` file inside the `config` directory.
    * Add the following configuration to `config/config.json`:

    ```json
    {
      "development": {
        "username": "your_db_username",
        "password": "your_db_password",
        "database": "summative_dev",
        "host": "127.0.0.1",
        "dialect": "postgres"
      },
      "test": {
        "username": "your_db_username",
        "password": "your_db_password",
        "database": "summative_test",
        "host": "127.0.0.1",
        "dialect": "postgres"
      },
      "production": {
        "username": "your_db_username",
        "password": "your_db_password",
        "database": "summative_prod",
        "host": "127.0.0.1",
        "dialect": "postgres"
      }
    }
    ```

    * Replace `"your_db_username"` and `"your_db_password"` with your actual PostgreSQL credentials.

## Running the Application

* **Development Mode:**

    ```bash
    npm run dev
    ```

    This will start the server using `nodemon`, which automatically restarts the server when file changes are detected.
* **Production Mode:**

    ```bash
    npm start
    ```

    This will start the server in production mode.

## Running Tests

* **Run the test suite:**

    ```bash
    npm test
    ```

    This command will execute the Jest test suite, ensuring that your application's logic is working as expected.

## API Endpoints

The application exposes the following API endpoints:

* **User Authentication:**
  * `POST /register`: Register a new user.
  * `POST /login`: Log in an existing user.
* **User Profile:**
  * `GET /profile`: Get the current user's profile.
  * `PUT /profile`: Update the current user's profile.
  * `PUT /location`: Update the current user's location.
  * `PUT /preferences`: Update the current user's preferences.
* **Events:**
  * `POST /events`: Create a new event.
  * `GET /events/search`: Search for events based on location and radius.
  * `GET /events/:id`: Get an event by its ID.
  * `PUT /events/:id`: Update an event.
  * `DELETE /events/:id`: Delete an event.
* **Notifications:**
  * `GET /notifications`: Get the current user's notifications.
  * `PUT /notifications/:id/read`: Mark a notification as read.

## Contributing

We welcome contributions to the Event Locator project! Please read our `CONTRIBUTING.md` file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.

## Contact

Willie B Daniles<w.daniels@alustudent.com>

If you have any questions or suggestions, please feel free to contact me.
