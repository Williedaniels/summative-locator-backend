// tests/authMiddleware.test.js
const request = require('supertest');
const express = require('express');
const authMiddleware = require('../src/middlewares/auth');
const { User } = require('../src/models');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock route to test the middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

describe('AuthMiddleware', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  it('should allow access with a valid token', async () => {
    // Create a user
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      country: 'USA',
      language: 'en',
    });

    // Generate a token for the user
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });

    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Protected route accessed');
    expect(res.body.user.id).toEqual(user.id);
    expect(res.body.user.email).toEqual(user.email);
    expect(res.body.user.username).toEqual(user.username);
  });

  it('should return 401 for no token', async () => {
    const res = await request(app).get('/protected');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized: No token provided');
  });

  it('should return 401 for invalid token format', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'InvalidToken');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized: Invalid token format');
  });

  it('should return 401 for invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid.token.here');
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual('Unauthorized: Invalid or expired token');
  });
});
