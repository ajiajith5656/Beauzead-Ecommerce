import React from 'react';
import { Plus } from 'lucide-react';

export const AdminManagement: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Admin Management</h2>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Admin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg">
          Admin Management module coming soon...
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Create, edit, and manage admin users and their permissions
        </p>
      </div>
    </div>
  );
};

export default AdminManagement;
