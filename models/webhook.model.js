const mongoose = require('mongoose');

const webhookSchema = new mongoose.Schema({
  ref: { type: String, required: true },
  before: { type: String, required: true },
  after: { type: String, required: true },
  repository: {
    name: { type: String, required: true },
    full_name: { type: String, required: true },
  },
  pusher: {
    name: { type: String, required: true },
    email: { type: String, default: "N/A" }, // Para casos donde email sea null
  },
  commits: [
    {
      message: { type: String, required: true },
      timestamp: { type: Date, required: true },
      url: { type: String, required: true },
      author: {
        name: { type: String, required: true },
        email: { type: String, default: "N/A" },
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Webhook', webhookSchema);
