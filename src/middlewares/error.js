const logger = require('../services/logger'); // Import the logger

module.exports = (err, req, res, next) => {
  logger.error('Unhandled error:', err); // Use the logger
  console.error(err.stack);

  if (process.env.NODE_ENV === 'development') {
    res.status(500).json({
      message: 'Internal Server Error',
      error: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
