const amqp = require('amqplib');
let channel;

const connect = async () => {
  try {
    const connection = await amqp.connect(process.env.AMQP_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error.message);
    throw error; // Re-throw the error to handle it upstream
  }
};

const sendMessage = (queue, message) => {
  try {
    if (!channel) {
      throw new Error('Channel is not initialized. Call connect() first.');
    }
    channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  } catch (error) {
    console.error(`Failed to send message to queue "${queue}":`, error.message);
    throw error; // Re-throw the error to handle it upstream
  }
};

module.exports = { connect, sendMessage };