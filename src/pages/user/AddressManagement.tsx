import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MobileNav } from '../../components/layout/MobileNav';
import AddressForm from '../../components/AddressForm';
import type { Address } from '../../components/AddressForm';
import { MapPin, Edit2, Trash2, Plus, ArrowLeft, Home, Briefcase } from 'lucide-react';

const UserAddressManagement: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr_1',
      fullName: 'John Doe',
      phoneNumber: '+91 9876543210',
      email: 'john@example.com',
      country: 'India',
      streetAddress1: '123 Main Street',
      streetAddress2: 'Apt 4B',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110001',
      addressType: 'home',
      deliveryNotes: 'Ring bell twice before delivery',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editingAddress = editingId ? addresses.find((a) => a.id === editingId) : undefined;

  const handleAddAddress = (data: Address) => {
    setIsLoading(true);
    setTimeout(() => {
      if (editingId) {
        setAddresses(addresses.map((a) => (a.id === editingId ? data : a)));
        setEditingId(null);
      } else {
        setAddresses([...addresses, data]);
      }
      setShowForm(false);
      setIsLoading(false);
    }, 500);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const getAddressTypeIcon = (type: 'home' | 'work' | 'other') => {
    switch (type) {
      case 'home':
        return <Home size={16} className="text-gold" />;
      case 'work':
        return <Briefcase size={16} className="text-gold" />;
      default:
        return <MapPin size={16} className="text-gold" />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-16 md:pb-0">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gold hover:text-yellow-400 transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Addresses</h1>
          <p className="text-gray-400">Manage your delivery addresses</p>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8">
            <AddressForm
              initialData={editingAddress}
              onSubmit={handleAddAddress}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
          >
            <Plus size={20} />
            Add New Address
          </button>
        )}

        {/* Addresses List */}
        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors relative"
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="absolute top-4 right-4 bg-gold text-black text-xs font-semibold px-3 py-1 rounded-full">
                    Default
                  </div>
                )}

                {/* Address Type Icon & Type */}
                <div className="flex items-center gap-2 mb-4">
                  {getAddressTypeIcon(address.addressType)}
                  <span className="text-sm font-semibold text-gold capitalize">{address.addressType}</span>
                </div>

                {/* Address Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-medium">{address.fullName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="text-sm">{address.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-sm break-all">{address.email}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-sm">
                      {address.streetAddress1}
                      {address.streetAddress2 && `, ${address.streetAddress2}`}
                    </p>
                    <p className="text-sm">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-400">{address.country}</p>
                  </div>

                  {address.deliveryNotes && (
                    <div>
                      <p className="text-sm text-gray-400">Delivery Notes</p>
                      <p className="text-sm text-gray-300">{address.deliveryNotes}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <button
                    onClick={() => handleEditClick(address.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={address.isDefault}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 px-4 py-2 bg-gold text-black rounded-lg hover:bg-yellow-400 transition-colors text-sm font-medium"
                    >
                      Set Default
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-2xl">
            <MapPin size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400 mb-4">No addresses added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
            >
              <Plus size={18} />
              Add Your First Address
            </button>
          </div>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default UserAddressManagement;
