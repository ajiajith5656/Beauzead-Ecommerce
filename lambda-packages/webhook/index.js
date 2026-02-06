// Lambda handler for Stripe Connect webhooks
const handler = require('./stripeWebhook.js').handler || require('./stripeWebhook.js').default;

exports.handler = handler;
