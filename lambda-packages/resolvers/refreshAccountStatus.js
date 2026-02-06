// Refresh Stripe Account Status Lambda Handler
const { refreshStripeAccountStatusHandler } = require('./stripeConnectResolvers.js');

exports.handler = refreshStripeAccountStatusHandler;
