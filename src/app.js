require('dotenv').config();
const express = require('express');
const i18n = require('i18next');
const i18nMiddleware = require('i18next-http-middleware');
const { sequelize } = require('./config/database');
const authMiddleware = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/error');
const logger = require('./services/logger'); // Import the logger
const eventsRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

// Initialize the Express application
const app = express();

// Database connection
sequelize.authenticate()
  .then(() => logger.info('Database connected')) 
  .catch(err => logger.error('Database connection error:', err));

// Sync database models
sequelize.sync({ force: false }) // false means it won't drop existing tables
  .then(() => logger.info('Database tables synced'))
  .catch(err => logger.error('Database sync error:', err));

// Internationalization setup
i18n
  .use(i18nMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: require('./locales/en.json') },
      es: { translation: require('./locales/es.json') },
      fr: { translation: require('./locales/fr.json') },
    }
  });

app.use(i18nMiddleware.handle(i18n));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - removed authentication for events
app.use('/api/events', eventsRoutes); // No auth middleware
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Protect the users routes
app.use('/api/profile', userRoutes);
app.use('/api/preferences', userRoutes);
app.use('/api/location', userRoutes);


// Error handling
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});