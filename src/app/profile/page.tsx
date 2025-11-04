'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import { User, Camera, Mail, Calendar, MapPin, Phone, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Financial planning enthusiast who loves tracking expenses and achieving savings goals.',
    joinedDate: '2024-01-15',
    avatar: null as File | null,
  });

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', profile);
    setEditing(false);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, avatar: file }));
    }
  };

  const stats = [
    { label: 'Total Budgets', value: '8', icon: '💰' },
    { label: 'Active Categories', value: '12', icon: '🏷️' },
    { label: 'Transactions', value: '156', icon: '📊' },
    { label: 'Days Active', value: '42', icon: '📅' },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your personal information and account details</p>
            </div>
            <button
              onClick={editing ? handleSave : () => setEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {editing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                'Edit Profile'
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-16 w-16 text-gray-600" />
                    </div>
                    {editing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700">
                        <Camera className="h-4 w-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Basic Info */}
                  <div className="text-center">
                    {editing ? (
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        className="text-xl font-bold text-gray-900 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500 mb-2"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                    )}
                    <p className="text-gray-600 mb-4">{profile.email}</p>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {editing ? (
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600">{profile.email}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {editing ? (
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600">{profile.phone}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      {editing ? (
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          className="text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <span className="text-gray-600">{profile.location}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">
                        Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-4 text-center">
                    <div className="text-2xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Bio Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                {editing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                )}
              </div>

              {/* Activity Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        💰
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Created new budget</p>
                        <p className="text-xs text-gray-500">Groceries - $500/month</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        ➕
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Added expense</p>
                        <p className="text-xs text-gray-500">Coffee - $4.50</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        📊
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Generated monthly report</p>
                        <p className="text-xs text-gray-500">October 2024 Summary</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}