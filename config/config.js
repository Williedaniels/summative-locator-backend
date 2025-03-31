require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // Use the dialect from .env
    logging: process.env.LOG_LEVEL === 'debug' ? console.log : false, // Log SQL queries if LOG_LEVEL is debug
  },
};
