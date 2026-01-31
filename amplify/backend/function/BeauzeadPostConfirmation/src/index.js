const { CognitoIdentityServiceProvider } = require('@aws-sdk/client-cognito-identity-provider');

const cognito = new CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION || 'us-east-1',
});

const USER_POOL_ID = process.env.USER_POOL_ID;

exports.handler = async (event) => {
  console.log('Post-confirmation event:', JSON.stringify(event, null, 2));

  const userPoolId = event.userPoolId || USER_POOL_ID;
  const userName = event.userName;
  const userAttributes = event.request.userAttributes;
  
  // Determine role from custom:role attribute or email pattern
  // For now, we'll use a simple heuristic: if user has phone_number, they're a seller
  const role = userAttributes['custom:role'] || (userAttributes.phone_number ? 'seller' : 'user');

  try {
    // Only add non-admin users to groups (admins should be added manually)
    if (role !== 'admin' && role) {
      console.log(`Adding user ${userName} to group: ${role}`);
      
      await cognito.adminAddUserToGroup({
        UserPoolId: userPoolId,
        Username: userName,
        GroupName: role,
      });

      console.log(`Successfully added user ${userName} to group ${role}`);
    }
  } catch (error) {
    // If group doesn't exist or user is already in group, log warning but don't fail
    console.warn(`Warning: Could not add user to group: ${error.message}`);
  }

  // Return the event to continue the authentication flow
  return event;
};
