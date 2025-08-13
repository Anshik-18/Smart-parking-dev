"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Car, 
  Store, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  CreditCard, 
  MapPin, 
  Moon, 
  Sun, 
  Globe, 
  Smartphone,
  ArrowRight,
  Check,
  AlertCircle
} from "lucide-react";

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  currentApp: 'user' | 'merchant';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<UserSettings>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    currentApp: 'user',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    theme: 'light',
    language: 'en'
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleAppSwitch = async (appType: 'user' | 'merchant') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (appType === 'merchant') {
        router.push('/merchant-app/home');
      } else {
        router.push('/user-app/home');
      }
    } catch (error) {
      console.error('Error switching app:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (newSettings: Partial<UserSettings>) => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettings(prev => ({ ...prev, ...newSettings }));
      setSaveStatus('saved');
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const toggleNotification = (type: keyof UserSettings['notifications']) => {
    const newNotifications = {
      ...settings.notifications,
      [type]: !settings.notifications[type]
    };
    handleSettingsUpdate({ notifications: newNotifications });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and app preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="space-y-6">
          
          {/* App Switching Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">App Mode</h2>
              <p className="text-sm text-gray-600">Switch between user and merchant applications</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* User App Card */}
                <div className={`relative border-2 rounded-xl p-6 transition-all cursor-pointer ${
                  settings.currentApp === 'user' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <Car className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">User App</h3>
                        <p className="text-sm text-gray-600">Find and book parking</p>
                      </div>
                    </div>
                    {settings.currentApp === 'user' && (
                      <div className="bg-blue-600 p-1 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Search nearby parking lots
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Book and manage reservations
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                      Track booking history
                    </li>
                  </ul>

                  {settings.currentApp !== 'user' && (
                    <button
                      onClick={() => handleAppSwitch('user')}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Switch to User App</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Merchant App Card */}
                <div className={`relative border-2 rounded-xl p-6 transition-all cursor-pointer ${
                  settings.currentApp === 'merchant' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-600 p-3 rounded-lg">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Merchant App</h3>
                        <p className="text-sm text-gray-600">Manage parking lots</p>
                      </div>
                    </div>
                    {settings.currentApp === 'merchant' && (
                      <div className="bg-purple-600 p-1 rounded-full">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                      Manage parking spaces
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                      View bookings and revenue
                    </li>
                    <li className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                      Analytics and insights
                    </li>
                  </ul>

                  {settings.currentApp !== 'merchant' && (
                    <button
                      onClick={() => handleAppSwitch('merchant')}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Switch to Merchant App</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Settings */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Information</h2>
              <p className="text-sm text-gray-600">Update your personal details</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => handleSettingsUpdate({ name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleSettingsUpdate({ phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>
          </div> */}

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Notifications</h2>
              <p className="text-sm text-gray-600">Choose how you want to be notified</p>
            </div>
            
            <div className="p-6 space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-600 p-2 rounded-lg">
                      {key === 'email' && <Bell className="w-4 h-4 text-white" />}
                      {key === 'push' && <Smartphone className="w-4 h-4 text-white" />}
                      {key === 'sms' && <User className="w-4 h-4 text-white" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{key} Notifications</p>
                      <p className="text-sm text-gray-600">
                        Receive updates via {key === 'push' ? 'push notifications' : key}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleNotification(key as keyof UserSettings['notifications'])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">App Preferences</h2>
              <p className="text-sm text-gray-600">Customize your app experience</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <div className="relative">
                    {settings.theme === 'light' && <Sun className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />}
                    {settings.theme === 'dark' && <Moon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />}
                    {settings.theme === 'system' && <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />}
                    <select
                      value={settings.theme}
                      onChange={(e) => handleSettingsUpdate({ theme: e.target.value as 'light' | 'dark' | 'system' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                      <option value="system">System Default</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={settings.language}
                      onChange={(e) => handleSettingsUpdate({ language: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="bn">বাংলা (Bengali)</option>
                      <option value="te">తెలుగు (Telugu)</option>
                      <option value="mr">मराठी (Marathi)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {/* <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Quick Actions</h2>
              <p className="text-sm text-gray-600">Manage your account security and data</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-600">Update your account password</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Payment Methods</p>
                      <p className="text-sm text-gray-600">Manage your payment options</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Saved Addresses</p>
                      <p className="text-sm text-gray-600">Manage your saved locations</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>

                <button className="flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5" />
                    <div className="text-left">
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm">Permanently delete your account</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div> */}

          {/* Save Status */}
          {/* {saveStatus !== 'idle' && (
            <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg ${
              saveStatus === 'saving' ? 'bg-blue-600 text-white' :
              saveStatus === 'saved' ? 'bg-green-600 text-white' :
              'bg-red-600 text-white'
            }`}>
              <div className="flex items-center space-x-2">
                {saveStatus === 'saving' && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {saveStatus === 'saved' && <Check className="w-4 h-4" />}
                {saveStatus === 'error' && <AlertCircle className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {saveStatus === 'saving' && 'Saving changes...'}
                  {saveStatus === 'saved' && 'Settings saved successfully!'}
                  {saveStatus === 'error' && 'Failed to save settings'}
                </span>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}