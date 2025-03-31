const { Sequelize } = require('sequelize');
const config = require('../../config/config.js')[process.env.NODE_ENV || 'development'];

// Initialize Sequelize with proper configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect, // Use the dialect from config.js
    logging: config.logging, // Log SQL queries if enabled
});

// Export the sequelize instance
module.exports = { sequelize };
