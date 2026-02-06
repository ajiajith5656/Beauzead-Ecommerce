// Get Stripe Account Status Lambda Handler
const { getStripeAccountStatusHandler } = require('./stripeConnectResolvers.js');

exports.handler = getStripeAccountStatusHandler;
