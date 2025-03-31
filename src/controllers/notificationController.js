const { Notification } = require('../models');

class NotificationController {
  async getUserNotifications(req, res) {
    try {
      const notifications = await Notification.findAll({
        where: { 
          userId: req.user.id 
        },
        order: [['createdAt', 'DESC']],
        limit: 50
      });

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async markNotificationAsRead(req, res) {
    try {
      const { id } = req.params;

      const notification = await Notification.findOne({
        where: { 
          id, 
          userId: req.user.id 
        }
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      await notification.update({ 
        isRead: true 
      });

      res.json(notification);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new NotificationController();