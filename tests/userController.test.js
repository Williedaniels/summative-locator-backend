// tests/userController.test.js
const request = require('supertest');
const express = require('express');
const { User } = require('../src/models');
const userController = require('../src/controllers/userController');
const authMiddleware = require('../src/middlewares/auth');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock the auth middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 'testuserid', username: 'testuser', email: 'test@example.com' };
  next();
};

app.post('/register', userController.register);
app.post('/login', userController.login);
app.get('/profile', mockAuthMiddleware, userController.getUserProfile);
app.put('/profile', mockAuthMiddleware, userController.updateUserProfile);
app.put('/location', mockAuthMiddleware, userController.updateUserLocation);
app.put('/preferences', mockAuthMiddleware, userController.updateUserPreferences);

describe('UserController', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        language: 'en',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.user.username).toEqual('testuser');
    expect(res.body.user.email).toEqual('test@example.com');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('language');
    expect(res.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.user.username).toEqual('testuser');
    expect(res.body.user.email).toEqual('test@example.com');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('language');
    expect(res.body).toHaveProperty('token');
  });

  it('should get user profile', async () => {
    await User.create({
      id: 'testuserid',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
    const res = await request(app).get('/profile');
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('testuser');
    expect(res.body.email).toEqual('test@example.com');
  });

  it('should update user profile', async () => {
    await User.create({
      id: 'testuserid',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
    const res = await request(app)
      .put('/profile')
      .send({ username: 'newuser', language: 'es' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual('newuser');
    expect(res.body.language).toEqual('es');
  });

  it('should update user location', async () => {
    await User.create({
      id: 'testuserid',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
    const res = await request(app)
      .put('/location')
      .send({ latitude: 40.7128, longitude: -74.0060 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.location.coordinates).toEqual([-74.0060, 40.7128]);
  });

  it('should update user preferences', async () => {
    await User.create({
      id: 'testuserid',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
    const res = await request(app)
      .put('/preferences')
      .send({ preferences: ['music', 'sports'] });
    expect(res.statusCode).toEqual(200);
    expect(res.body.preferences).toEqual(['music', 'sports']);
  });
});
