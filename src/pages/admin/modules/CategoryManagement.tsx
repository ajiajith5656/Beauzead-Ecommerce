import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Save, X } from 'lucide-react';
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

interface SubCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
}

interface Category {
  id: string;
  categoryId: string;
  name: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sub_categories?: SubCategory[];
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

const listCategoriesQuery = `
  query ListCategories {
    listCategories {
      id
      categoryId
      name
      slug
      description
      image_url
      parent_id
      sub_categories {
        id
        name
        slug
        description
        image_url
      }
      is_active
      sort_order
      created_at
      updated_at
    }
  }
`;

const createCategoryMutation = `
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      categoryId
      name
      slug
      description
      image_url
      is_active
      sub_categories {
        id
        name
      }
    }
  }
`;

const updateCategoryMutation = `
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      categoryId
      name
      slug
      description
      image_url
      is_active
    }
  }
`;

const deleteCategoryMutation = `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  });
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [newSubCategory, setNewSubCategory] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result: any = await client.graphql({
        query: listCategoriesQuery,
      });
      
      if (result.data?.listCategories) {
        setCategories(result.data.listCategories);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        setError('Category name is required');
        return;
      }

      const input = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        image_url: formData.image_url,
        is_active: formData.is_active,
        sub_categories: subCategories,
      };

      if (editingId) {
        await client.graphql({
          query: updateCategoryMutation,
          variables: { id: editingId, input },
        });
        setSuccess('Category updated successfully');
      } else {
        await client.graphql({
          query: createCategoryMutation,
          variables: { input },
        });
        setSuccess('Category created successfully');
      }

      await fetchCategories();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Failed to save category');
      console.error('Error saving category:', err);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await client.graphql({
        query: deleteCategoryMutation,
        variables: { id: categoryId },
      });
      setSuccess('Category deleted successfully');
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Failed to delete category');
      console.error('Error deleting category:', err);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.categoryId);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      image_url: category.image_url || '',
      is_active: category.is_active,
    });
    setSubCategories(category.sub_categories || []);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      is_active: true,
    });
    setSubCategories([]);
    setNewSubCategory({ name: '', description: '' });
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const addSubCategory = () => {
    if (!newSubCategory.name.trim()) return;
    
    const subCat: SubCategory = {
      id: Date.now().toString(),
      name: newSubCategory.name,
      slug: newSubCategory.name.toLowerCase().replace(/\s+/g, '-'),
      description: newSubCategory.description,
    };
    
    setSubCategories([...subCategories, subCat]);
    setNewSubCategory({ name: '', description: '' });
  };

  const removeSubCategory = (id: string) => {
    setSubCategories(subCategories.filter(sub => sub.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex justify-between items-center">
          <span className="text-red-800">{error}</span>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
            <X size={18} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center">
          <span className="text-green-800">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Category Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage categories and subcategories</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.categoryId} className="hover:bg-gray-50">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => toggleExpand(category.categoryId)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {(category.sub_categories?.length || 0) > 0 ? (
                        expandedCategories.has(category.categoryId) ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronRight size={20} />
                        )
                      ) : (
                        <div className="w-5" />
                      )}
                    </button>
                    
                    {category.image_url && (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                      {(category.sub_categories?.length || 0) > 0 && (
                        <span className="text-xs text-gray-500">
                          {category.sub_categories?.length} subcategories
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        category.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {category.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    
                    <button
                      onClick={() => startEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(category.categoryId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.has(category.categoryId) &&
                  category.sub_categories &&
                  category.sub_categories.length > 0 && (
                    <div className="pl-16 pr-4 pb-4 space-y-2">
                      {category.sub_categories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium text-gray-900">{sub.name}</h4>
                            {sub.description && (
                              <p className="text-sm text-gray-600">{sub.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No categories found. Click "Add Category" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="e.g., Electronics"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL-friendly name)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="Auto-generated from name"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="Brief description of the category"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active (visible to users)
                </label>
              </div>

              {/* Subcategories Section */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Subcategories</h3>
                
                {/* Existing Subcategories */}
                <div className="space-y-2 mb-4">
                  {subCategories.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{sub.name}</h4>
                        {sub.description && (
                          <p className="text-sm text-gray-600">{sub.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeSubCategory(sub.id)}
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add New Subcategory */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newSubCategory.name}
                    onChange={(e) =>
                      setNewSubCategory({ ...newSubCategory, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="Subcategory name"
                  />
                  <input
                    type="text"
                    value={newSubCategory.description}
                    onChange={(e) =>
                      setNewSubCategory({ ...newSubCategory, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                    placeholder="Subcategory description (optional)"
                  />
                  <button
                    onClick={addSubCategory}
                    disabled={!newSubCategory.name.trim()}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Subcategory
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {editingId ? 'Update' : 'Create'} Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
