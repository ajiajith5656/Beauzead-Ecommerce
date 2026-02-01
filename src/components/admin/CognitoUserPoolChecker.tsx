import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * CognitoUserPoolChecker Component - Frontend Check Only
 * For full checks, use CLI: ./cognito-check.sh
 */
export const CognitoUserPoolChecker: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Test API connection
      const response = await fetch('/.well-known/amplify', {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Amplify configuration not available');
      }
      alert('✅ Frontend connected to Amplify backend!');
    } catch (err) {
      setError(`Connection test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">⚠️ Admin access required</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🔐 Amplify Connection Status</h2>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded">
          <p className="font-semibold text-lg">Frontend Status</p>
          <p className="text-green-600">✅ Application running</p>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <p className="font-semibold text-lg">User Pool</p>
          <p className="text-sm text-gray-600 font-mono">us-east-1_PPPmNH7HL</p>
        </div>

        <div className="bg-blue-50 p-4 rounded">
          <p className="font-semibold text-lg">GraphQL Endpoint</p>
          <p className="text-sm text-gray-600 break-all">
            https://woqi3tosm5a2jnj4w6zit2mfye.appsync-api.us-east-1.amazonaws.com/graphql
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold mb-2">For full checks, use CLI:</h3>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm overflow-auto">
{`chmod +x cognito-check.sh
./cognito-check.sh summary`}
        </pre>
      </div>
    </div>
  );
};
