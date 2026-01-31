import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, LogOut, CheckCircle, XCircle, FileText } from 'lucide-react';
import { getPendingUsers, approveUser, rejectUser, getDashboardMetrics } from '../../services/admin/adminApiService';
import { KYCRequirementManagement } from './modules/KYCRequirementManagement';
import type { User, DashboardData } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'kyc'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      const [users, metricsData] = await Promise.all([
        getPendingUsers(),
        getDashboardMetrics(),
      ]);
      
      setPendingUsers(users || []);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setErrorMessage('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      setErrorMessage('');
      const result = await approveUser(userId);
      if (result) {
        // Refresh the list
        fetchData();
      } else {
        setErrorMessage('Failed to approve user. Please try again.');
      }
    } catch (error) {
      console.error('Error approving user:', error);
      setErrorMessage('Failed to approve user. Please try again.');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setErrorMessage('');
      const result = await rejectUser(userId);
      if (result) {
        // Refresh the list
        fetchData();
      } else {
        setErrorMessage('Failed to reject user. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
      setErrorMessage('Failed to reject user. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (user?.role !== 'admin' || !user?.approved) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-gold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            You do not have permission to access the admin dashboard.
          </p>
          <button onClick={handleSignOut} className="btn-secondary">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-900 border-b border-gold">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gold">Beauzead Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user?.full_name}</span>
              <button
                onClick={handleSignOut}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gold mb-8">Admin Dashboard</h2>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold flex items-center space-x-2 ${
              activeTab === 'overview'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={20} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-6 py-3 font-semibold flex items-center space-x-2 ${
              activeTab === 'kyc'
                ? 'text-gold border-b-2 border-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText size={20} />
            <span>KYC Requirements</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Total Users</h3>
              <Users className="h-8 w-8 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">{metrics?.metrics?.total_users || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Registered users</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Total Products</h3>
              <Package className="h-8 w-8 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">{metrics?.metrics?.total_products || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Listed products</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Total Orders</h3>
              <ShoppingCart className="h-8 w-8 text-gold" />
            </div>
            <p className="text-3xl font-bold text-gold">{metrics?.metrics?.ongoing_orders || 0}</p>
            <p className="text-gray-400 text-sm mt-2">Ongoing orders</p>
          </div>
        </div>

        <div className="card">
          <h3 className="text-2xl font-semibold text-gold mb-4">
            Pending Approvals ({pendingUsers.length})
          </h3>
          
          {errorMessage && (
            <div className="mb-4 rounded-md bg-red-900 bg-opacity-20 p-4 border border-red-700">
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}
          
          {loading ? (
            <div className="text-center text-gray-400 py-8">Loading...</div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No pending approvals at this time.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {pendingUsers.map((pendingUser) => (
                    <tr key={pendingUser.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {pendingUser.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {pendingUser.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gold bg-opacity-20 text-gold">
                          {pendingUser.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(pendingUser.id)}
                            className="text-green-500 hover:text-green-400 flex items-center space-x-1"
                          >
                            <CheckCircle className="h-5 w-5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleReject(pendingUser.id)}
                            className="text-red-500 hover:text-red-400 flex items-center space-x-1"
                          >
                            <XCircle className="h-5 w-5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}

        {/* KYC Requirements Tab */}
        {activeTab === 'kyc' && (
          <KYCRequirementManagement />
        )}
      </div>
    </div>
  );
};
