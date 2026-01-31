import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

export interface TableConfig {
  name: string;
  fields: {
    name: string;
    type: 'text' | 'number' | 'email' | 'textarea' | 'boolean' | 'date';
    required?: boolean;
  }[];
  onAdd: (data: any) => Promise<boolean>;
  onEdit: (id: string, data: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onFetch: () => Promise<any[]>;
}

interface TableManagerProps {
  config: TableConfig;
}

export const TableManager: React.FC<TableManagerProps> = ({ config }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await config.onFetch();
    setItems(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    const initialData: any = {};
    config.fields.forEach((field) => {
      initialData[field.name] = '';
    });
    setFormData(initialData);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = config.fields.filter((f) => f.required);
    for (const field of requiredFields) {
      if (!formData[field.name]) {
        alert(`${field.name} is required`);
        return;
      }
    }

    if (editingId) {
      const success = await config.onEdit(editingId, formData);
      if (success) {
        alert('Updated successfully');
        loadItems();
        setShowForm(false);
      }
    } else {
      const success = await config.onAdd(formData);
      if (success) {
        alert('Created successfully');
        loadItems();
        setShowForm(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this item?')) {
      const success = await config.onDelete(id);
      if (success) {
        alert('Deleted successfully');
        loadItems();
      }
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData({ ...formData, [fieldName]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
            <p className="text-gray-600 mt-2">Manage {config.name.toLowerCase()}</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add {config.name}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? `Edit ${config.name}` : `Add New ${config.name}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.name}
                      {field.required && '*'}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.name}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        required={field.required}
                      />
                    ) : field.type === 'boolean' ? (
                      <select
                        value={formData[field.name] ? 'true' : 'false'}
                        onChange={(e) => handleFieldChange(field.name, e.target.value === 'true')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="false">False</option>
                        <option value="true">True</option>
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 rounded-lg"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No items found. Create one to get started.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {config.fields.map((field) => (
                    <th
                      key={field.name}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      {field.name}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {config.fields.map((field) => (
                      <td
                        key={`${item.id}-${field.name}`}
                        className="px-6 py-4 text-sm text-gray-700"
                      >
                        {typeof item[field.name] === 'boolean'
                          ? item[field.name]
                            ? 'Yes'
                            : 'No'
                          : item[field.name]}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center gap-1"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 font-semibold inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
