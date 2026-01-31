const AWS = require('aws-sdk');

// Lambda includes AWS SDK v2 by default
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
});

const USER_POOL_ID = 'us-east-1_PPPmNH7HL';

exports.handler = async (event) => {
  console.log('Post-confirmation event:', JSON.stringify(event, null, 2));

  const userPoolId = event.userPoolId || USER_POOL_ID;
  const userName = event.userName;
  const userAttributes = event.request.userAttributes;
  
  // Determine role: if user has phone_number, they're a seller, otherwise user
  const role = userAttributes.phone_number ? 'seller' : 'user';

  try {
    // Only add non-admin users to groups
    if (role && role !== 'admin') {
      console.log(`Adding user ${userName} to group: ${role}`);
      
      const params = {
        UserPoolId: userPoolId,
        Username: userName,
        GroupName: role,
      };
      
      await cognito.adminAddUserToGroup(params).promise();
      console.log(`Successfully added user ${userName} to group ${role}`);
    }
  } catch (error) {
    console.warn(`Warning: Could not add user to group: ${error.message}`);
    // Don't fail the signup - just log the warning
  }

  // Return event to continue authentication flow
  return event;
};
