// src/services/notificationService.js
const Redis = require('ioredis');
const { Event, User } = require('../models');

class NotificationService {
  constructor() {
    this.publisher = new Redis();
    this.subscriber = new Redis();
    this.NOTIFICATION_CHANNEL = 'event-notifications';
  }

  async subscribeToEventNotifications() {
    await this.subscriber.subscribe(this.NOTIFICATION_CHANNEL);
    
    this.subscriber.on('message', (channel, message) => {
      if (channel === this.NOTIFICATION_CHANNEL) {
        this.processNotification(JSON.parse(message));
      }
    });
  }

  async sendEventNotification(event) {
    // Find users with matching preferences
    const interestedUsers = await User.findAll({
      where: {
        language: event.language,
        preferences: {
          [Op.contains]: [event.category]
        }
      }
    });

    const notificationPayload = {
      eventId: event.id,
      title: event.title,
      startDateTime: event.startDateTime,
      users: interestedUsers.map(u => u.id)
    };

    // Publish notification to Redis channel
    await this.publisher.publish(
      this.NOTIFICATION_CHANNEL, 
      JSON.stringify(notificationPayload)
    );
  }

  async processNotification(notification) {
    // Send email or push notification logic here
    console.log('Processing notification:', notification);
  }
}

module.exports = new NotificationService();