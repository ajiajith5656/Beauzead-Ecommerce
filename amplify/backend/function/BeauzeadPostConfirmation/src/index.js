exports.handler = async (event) => {
  console.log('Post-confirmation event:', JSON.stringify(event, null, 2));

  const userName = event.userName;
  const userAttributes = event.request.userAttributes;
  const phoneNumber = userAttributes.phone_number;
  
  // Determine role: if user has phone_number, they're a seller, otherwise user
  const role = phoneNumber ? 'seller' : 'user';

  console.log(`Post-confirmation: User ${userName} verified with phone ${phoneNumber}, role should be: ${role}`);
  
  // NOTE: Group assignment must be done outside post-confirmation trigger
  // because Lambda doesn't have built-in SDK and external packages can't be added
  // without package.json and dependencies layer.
  // Use a scheduled task or login flow to assign groups instead.

  // Return event to continue authentication flow
  return event;
};
