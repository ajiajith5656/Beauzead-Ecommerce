// AWS SDK v2 - Built-in to Node.js 18 Lambda runtime
const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: process.env.AWS_REGION || 'us-east-1',
});

exports.handler = async (event) => {
  console.log('=== Post-Confirmation Lambda Triggered ===');
  console.log('Event:', JSON.stringify(event, null, 2));

  const userPoolId = event.userPoolId;
  const userName = event.userName;
  const userAttributes = event.request.userAttributes;
  const phoneNumber = userAttributes?.phone_number;

  // Determine role: if user has phone_number, they're a seller, otherwise user
  const role = phoneNumber ? 'seller' : 'user';

  console.log(`User: ${userName}`);
  console.log(`Phone: ${phoneNumber || 'none'}`);
  console.log(`Assigned Role: ${role}`);

  try {
    // Add user to appropriate group
    const groupParams = {
      UserPoolId: userPoolId,
      Username: userName,
      GroupName: role,
    };

    console.log(`Adding user to group "${role}"...`);
    await cognito.adminAddUserToGroup(groupParams).promise();
    console.log(`✓ Successfully added ${userName} to group "${role}"`);

  } catch (error) {
    console.error(`✗ Error adding user to group: ${error.message}`);
    console.error('Full error:', error);
    
    // Don't fail the entire post-confirmation
    // Log but allow signup to complete
    throw new Error(`Failed to assign group: ${error.message}`);
  }

  console.log('=== Post-Confirmation Complete ===');
  return event;
};
