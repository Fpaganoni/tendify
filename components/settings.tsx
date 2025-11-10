"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Bell,
  CreditCard,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background text-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-primary/80">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 bg-muted bg-opacity-50 backdrop-blur-lg rounded-xl p-4  ring-1 ring-primary h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-orange text-white"
                        : "text-primary hover:bg-contrast-gradient"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-muted bg-opacity-50 backdrop-blur-lg rounded-xl p-6 ring-1 ring-primary">
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Account Information</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary/80 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="user@example.com"
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange max-h-36"
                    />
                  </div>

                  <button className="bg-orange hover:bg-orange/80 text-primary cursor-pointer font-medium px-6 py-3 rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full bg-background ring-1 ring-primary rounded-lg px-4 py-3 text-primary/80 focus:outline-none focus:ring-2 focus:ring-orange"
                    />
                  </div>

                  <div className="pt-4 border-t border-primary/80">
                    <h3 className="font-semibold mb-3">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-primary/80 text-sm mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="bg-background hover:bg-contrast-gradient text-primary font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer">
                      Enable 2FA
                    </button>
                  </div>

                  <button className="bg-orange hover:bg-orange/80 text-primary font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">
                        Receive notifications via email
                      </p>
                    </div>
                    <button
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        emailNotifications ? "bg-orange-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          emailNotifications ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Order Updates</h3>
                      <p className="text-gray-400 text-sm">
                        Get notified about order status changes
                      </p>
                    </div>
                    <button
                      onClick={() => setOrderUpdates(!orderUpdates)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        orderUpdates ? "bg-orange-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          orderUpdates ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold">Promotions & Offers</h3>
                      <p className="text-gray-400 text-sm">
                        Receive special offers and discounts
                      </p>
                    </div>
                    <button
                      onClick={() => setPromotions(!promotions)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        promotions ? "bg-orange-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          promotions ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg border-2 border-orange-500">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          VISA
                        </div>
                        <div>
                          <p className="font-semibold">•••• •••• •••• 4242</p>
                          <p className="text-gray-400 text-sm">Expires 12/26</p>
                        </div>
                      </div>
                      <span className="text-xs bg-orange-500 px-2 py-1 rounded-full">
                        Default
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-red-400 to-orange-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          MC
                        </div>
                        <div>
                          <p className="font-semibold">•••• •••• •••• 8888</p>
                          <p className="text-gray-400 text-sm">Expires 09/25</p>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white text-sm">
                        Remove
                      </button>
                    </div>
                  </div>

                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg border-2 border-dashed border-gray-600 transition-colors">
                    + Add New Payment Method
                  </button>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Preferences</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                      <div>
                        <h3 className="font-semibold">Dark Mode</h3>
                        <p className="text-gray-400 text-sm">
                          Use dark theme across the site
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? "bg-orange-500" : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="font-semibold mb-2">Language</h3>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>English</option>
                      <option>Español</option>
                      <option>Français</option>
                      <option>Deutsch</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="font-semibold mb-2">Currency</h3>
                    <select className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>

                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
