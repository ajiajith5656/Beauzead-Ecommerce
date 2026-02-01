/**
 * Cognito User Pool Checker Utility
 * 
 * NOTE: This is a backend/CLI utility. For frontend use, the AWS SDK v3 must be installed:
 * npm install @aws-sdk/client-cognito-identity-provider
 * 
 * For frontend checks, use the CLI script: ./cognito-check.sh
 * Or use AWS CLI directly
 */

// Configuration from environment
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

export interface CognitoUser {
  username: string;
  email?: string;
  status: string;
  createdAt?: Date;
  lastModified?: Date;
}

export interface CognitoGroup {
  name: string;
  description?: string;
  precedence?: number;
}

/**
 * Get user pool summary via API call
 * This calls your backend API which has AWS SDK access
 */
export async function getUserPoolSummary(): Promise<any> {
  try {
    if (!API_ENDPOINT) {
      throw new Error('API_ENDPOINT not configured in environment');
    }

    const response = await fetch(`${API_ENDPOINT}/cognito/summary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user pool summary: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting user pool summary:', error);
    throw error;
  }
}

/**
 * List all users via API call
 */
export async function listAllUsers(): Promise<CognitoUser[]> {
  try {
    if (!API_ENDPOINT) {
      throw new Error('API_ENDPOINT not configured in environment');
    }

    const response = await fetch(`${API_ENDPOINT}/cognito/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list users: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing users:', error);
    throw error;
  }
}

/**
 * List all groups via API call
 */
export async function listAllGroups(): Promise<CognitoGroup[]> {
  try {
    if (!API_ENDPOINT) {
      throw new Error('API_ENDPOINT not configured in environment');
    }

    const response = await fetch(`${API_ENDPOINT}/cognito/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list groups: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing groups:', error);
    throw error;
  }
}

/**
 * Get user details via API call
 */
export async function displayUserDetails(username: string): Promise<any> {
  try {
    if (!API_ENDPOINT) {
      throw new Error('API_ENDPOINT not configured in environment');
    }

    const response = await fetch(`${API_ENDPOINT}/cognito/users/${encodeURIComponent(username)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user details: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error getting user details for ${username}:`, error);
    throw error;
  }
}
