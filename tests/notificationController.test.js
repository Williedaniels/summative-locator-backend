// tests/notificationController.test.js
const request = require('supertest');
const express = require('express');
const { Notification, User } = require('../src/models');
const notificationController = require('../src/controllers/notificationController');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock the auth middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 'testuserid', username: 'testuser', email: 'test@example.com' };
  next();
};

app.get('/notifications', mockAuthMiddleware, notificationController.getUserNotifications);
app.put('/notifications/:id/read', mockAuthMiddleware, notificationController.markNotificationAsRead);

describe('NotificationController', () => {
  beforeEach(async () => {
    await Notification.destroy({ where: {} });
    await User.destroy({ where: {} });
    await User.create({
      id: 'testuserid',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
  });

  it('should get user notifications', async () => {
    await Notification.create({
      userId: 'testuserid',
      message: 'Test Notification 1',
      isRead: false,
    });
    await Notification.create({
      userId: 'testuserid',
      message: 'Test Notification 2',
      isRead: false,
    });

    const res = await request(app).get('/notifications');

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it('should mark a notification as read', async () => {
    const notification = await Notification.create({
      userId: 'testuserid',
      message: 'Test Notification',
      isRead: false,
    });

    const res = await request(app).put(`/notifications/${notification.id}/read`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.isRead).toEqual(true);
  });
});
