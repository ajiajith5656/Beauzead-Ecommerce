// Create Stripe Connect Account Lambda Handler
const { createStripeConnectAccountHandler } = require('./stripeConnectResolvers.js');

exports.handler = createStripeConnectAccountHandler;
