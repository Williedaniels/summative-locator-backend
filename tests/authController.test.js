// tests/authController.test.js
const request = require('supertest');
const express = require('express');
const { User } = require('../src/models');
const authController = require('../src/controllers/authController');
const authRoutes = require('../src/routes/auth');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', authRoutes);

describe('AuthController', () => {
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
        country: 'USA',
        language: 'en',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('user_registered');
    expect(res.body.user.username).toEqual('testuser');
    expect(res.body.user.email).toEqual('test@example.com');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('language');
  });

  it('should not register a user with existing email', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      country: 'USA',
      language: 'en',
    });

    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser2',
        email: 'test@example.com',
        password: 'password123',
        country: 'USA',
        language: 'en',
      });

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual('user_already_exists');
  });

  it('should login a user', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      country: 'USA',
      language: 'en',
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual('login_success');
    expect(res.body.user.username).toEqual('testuser');
    expect(res.body.user.email).toEqual('test@example.com');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('language');
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      country: 'USA',
      language: 'en',
    });

    const res = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toEqual(false);
    expect(res.body.message).toEqual('invalid_credentials');
  });
});
