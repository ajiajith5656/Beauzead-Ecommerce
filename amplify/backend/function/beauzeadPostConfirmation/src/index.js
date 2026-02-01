/**
 * PostConfirmation Lambda Trigger
 * Automatically assigns users to groups based on signup type
 */

const AWS = require('aws-sdk');
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
  console.log('PostConfirmation Lambda triggered:', JSON.stringify(event));

  const userPoolId = event.userPoolId;
  const username = event.userName;
  const signupType = event.request.userAttributes['custom:signupType'] || 'user';

  // Map signup type to Cognito group
  let groupName = 'user'; // default
  if (signupType === 'seller') {
    groupName = 'seller';
  } else if (signupType === 'admin') {
    groupName = 'admin';
  }

  try {
    console.log(`Attempting to add user ${username} to group ${groupName}`);

    const params = {
      GroupName: groupName,
      UserPoolId: userPoolId,
      Username: username,
    };

    await cognito.adminAddUserToGroup(params).promise();
    console.log(`Successfully added ${username} to ${groupName} group`);
  } catch (error) {
    console.error('Error adding user to group:', error);
    // Don't throw error - allow signup to continue
  }

  return event;
};
