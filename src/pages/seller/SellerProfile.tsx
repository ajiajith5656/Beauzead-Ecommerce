import React, { useState } from 'react';
import { logger } from '../../utils/logger';
import { Edit2, Save, X, Upload } from 'lucide-react';

export const SellerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    shopName: 'Beauzead Store',
    description: 'Premium electronics and accessories',
    email: 'seller@beauzead.com',
    phone: '+91 98765 43210',
    website: 'https://beauzead.com',
    address: '123 Business Street',
    city: 'Bangalore',
    state: 'Karnataka',
    zipCode: '560001',
    bankName: 'HDFC Bank',
    accountNumber: '••••••••••••1234',
    ifscCode: 'HDFC0001234'
  });

  const [shopLogo, setShopLogo] = useState('https://via.placeholder.com/200');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setShopLogo(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // TODO: Implement save API call
    logger.log('Profile saved', { formData });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
              <p className="text-gray-600 mt-2">Manage your shop information and settings</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Shop Logo Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-8">
            <div>
              <img
                src={shopLogo}
                alt="Shop Logo"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shop Logo</h3>
              <p className="text-gray-600 text-sm mb-4">
                Upload a logo that represents your shop. Recommended size: 512x512px
              </p>
              {isEditing && (
                <label className="inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Change Logo
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Shop Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          <hr />

          {/* Address Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr />

          {/* Bank Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Bank Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 text-sm">
                Bank details are encrypted and secure. They are used only for payment settlements.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="password"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
