import React, { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Loader2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promotion' | 'system' | 'review';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export const NotificationsPage: React.FC = () => {
  const { user, currentAuthUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    // Check if user is logged in
    if (!user && !currentAuthUser) {
      navigate('/login');
      return;
    }

    // Simulate fetching notifications
    const loadNotifications = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual GraphQL query
        const mockNotifications: Notification[] = [
          {
            id: '1',
            title: 'Order Confirmed',
            message: 'Your order ORD-001 has been confirmed and is being processed.',
            type: 'order',
            timestamp: '2026-01-29T10:30:00',
            read: false,
            actionUrl: '/orders',
          },
          {
            id: '2',
            title: 'Delivery Update',
            message: 'Your order ORD-002 is out for delivery. Expected delivery today.',
            type: 'order',
            timestamp: '2026-01-28T14:15:00',
            read: false,
            actionUrl: '/orders',
          },
          {
            id: '3',
            title: 'Special Offer',
            message: 'Get 30% off on Electronics! Limited time offer.',
            type: 'promotion',
            timestamp: '2026-01-27T08:00:00',
            read: true,
          },
          {
            id: '4',
            title: 'Review Reminder',
            message: 'Share your experience with the products you purchased.',
            type: 'review',
            timestamp: '2026-01-26T16:45:00',
            read: true,
          },
          {
            id: '5',
            title: 'System Maintenance',
            message: 'Platform will undergo maintenance on Jan 30, 2-4 AM IST.',
            type: 'system',
            timestamp: '2026-01-25T12:00:00',
            read: true,
          },
        ];

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setNotifications(mockNotifications);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [user, currentAuthUser, navigate]);

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : selectedFilter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.read);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-900 text-blue-200';
      case 'promotion':
        return 'bg-green-900 text-green-200';
      case 'system':
        return 'bg-gray-700 text-gray-200';
      case 'review':
        return 'bg-purple-900 text-purple-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'system':
        return '⚙️';
      case 'review':
        return '⭐';
      default:
        return '•';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gold mb-2">Notifications</h1>
            <p className="text-gray-400">Stay updated with your latest activities</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          {(['all', 'unread', 'read'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                selectedFilter === filter
                  ? 'bg-gold text-black'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
              {filter === 'unread' && ` (${unreadCount})`}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-gold animate-spin mr-3" />
            <span className="text-white text-lg">Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
            <Bell className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Notifications</h2>
            <p className="text-gray-400">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 transition-all duration-300 flex items-start gap-4 group ${
                  notification.read
                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                    : 'bg-gray-800 border-gold hover:bg-gray-750'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getTypeColor(notification.type)}`}>
                  {getTypeIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-grow">
                      <h3 className={`font-bold mb-1 ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </h3>
                      <p className={`text-sm mb-2 ${notification.read ? 'text-gray-500' : 'text-gray-300'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-600">{formatTime(notification.timestamp)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 hover:bg-gray-700 rounded-lg transition-all duration-300 text-gold"
                          title="Mark as read"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 hover:bg-red-900 hover:text-red-400 rounded-lg transition-all duration-300 text-gray-400"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Link */}
                  {notification.actionUrl && (
                    <button
                      onClick={() => navigate(notification.actionUrl!)}
                      className="text-gold text-sm font-medium hover:text-yellow-400 transition-all duration-300 mt-2"
                    >
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
