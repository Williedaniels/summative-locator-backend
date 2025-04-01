// tests/eventController.test.js
const request = require('supertest');
const express = require('express');
const { Event, User } = require('../src/models');
const eventController = require('../src/controllers/eventController');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock the auth middleware
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 'testuserid', username: 'testuser', email: 'test@example.com' };
  next();
};

app.post('/events', mockAuthMiddleware, eventController.createEvent);
app.get('/events/search', eventController.searchEvents);
app.get('/events/:id', eventController.getEventById);
app.put('/events/:id', mockAuthMiddleware, eventController.updateEvent);
app.delete('/events/:id', mockAuthMiddleware, eventController.deleteEvent);

describe('EventController', () => {
  beforeEach(async () => {
    await Event.destroy({ where: {} });
    await User.destroy({ where: {} });
    await User.create({
      id: 'testuserid',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      language: 'en',
    });
  });

  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        title: 'Test Event',
        description: 'This is a test event',
        location: { latitude: 40.7128, longitude: -74.0060 },
        startDateTime: '2024-12-31T10:00:00Z',
        category: 'music',
        maxParticipants: 10,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toEqual('Test Event');
    expect(res.body.description).toEqual('This is a test event');
    expect(res.body.location.coordinates).toEqual([-74.0060, 40.7128]);
    expect(res.body.category).toEqual('music');
    expect(res.body.maxParticipants).toEqual(10);
  });

  it('should search events within a radius', async () => {
    await Event.create({
      title: 'Test Event',
      description: 'This is a test event',
      location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
      startDateTime: '2024-12-31T10:00:00Z',
      category: 'music',
      maxParticipants: 10,
      userId: 'testuserid'
    });

    const res = await request(app)
      .get('/events/search')
      .query({ latitude: 40.7128, longitude: -74.0060, radius: 10 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get an event by ID', async () => {
    const event = await Event.create({
      title: 'Test Event',
      description: 'This is a test event',
      location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
      startDateTime: '2024-12-31T10:00:00Z',
      category: 'music',
      maxParticipants: 10,
      userId: 'testuserid'
    });

    const res = await request(app).get(`/events/${event.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Test Event');
  });

  it('should update an event', async () => {
    const event = await Event.create({
      title: 'Test Event',
      description: 'This is a test event',
      location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
      startDateTime: '2024-12-31T10:00:00Z',
      category: 'music',
      maxParticipants: 10,
      userId: 'testuserid'
    });

    const res = await request(app)
      .put(`/events/${event.id}`)
      .send({ title: 'Updated Event', location: { latitude: 41.7128, longitude: -75.0060 } });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Event');
    expect(res.body.location.coordinates).toEqual([-75.0060, 41.7128]);
  });

  it('should delete an event', async () => {
    const event = await Event.create({
      title: 'Test Event',
      description: 'This is a test event',
      location: { type: 'Point', coordinates: [-74.0060, 40.7128] },
      startDateTime: '2024-12-31T10:00:00Z',
      category: 'music',
      maxParticipants: 10,
      userId: 'testuserid'
    });

    const res = await request(app).delete(`/events/${event.id}`);

    expect(res.statusCode).toEqual(204);
  });
});
