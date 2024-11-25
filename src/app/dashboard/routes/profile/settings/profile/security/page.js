"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaShieldAlt, 
  FaKey, 
  FaLock, 
  FaMobile, 
  FaBell, 
  FaHistory,
  FaFingerprint,
  FaEnvelope,
  FaCheckCircle
} from 'react-icons/fa'

export default function SecuritySettings() {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true
  })

  const securityLogs = [
    {
      id: 1,
      action: 'Password Changed',
      date: '2024-01-15 14:30',
      location: 'New York, USA',
      device: 'Chrome / Windows'
    },
    {
      id: 2,
      action: 'Login Attempt',
      date: '2024-01-14 09:15',
      location: 'London, UK',
      device: 'Safari / iOS'
    },
    {
      id: 3,
      action: '2FA Enabled',
      date: '2024-01-13 16:45',
      location: 'Paris, France',
      device: 'Firefox / MacOS'
    }
  ]

  const PasswordChangeModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              className="w-full mt-1 px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 md:p-8 rounded-lg shadow-lg text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide mb-2">
          Security Settings
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Manage your account security and privacy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Options */}
        <div className="space-y-6">
          {/* Password Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaKey className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold">Password</h3>
                  <p className="text-sm text-gray-600">Last changed 7 days ago</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-red-600 to-red-800"
              >
                Change
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Contains uppercase & lowercase letters</span>
              </div>
              <div className="flex items-center text-sm">
                <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center text-sm">
                <FaCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>Contains numbers & symbols</span>
              </div>
            </div>
          </motion.div>

          {/* Two-Factor Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaFingerprint className="h-6 w-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-lg
                  ${twoFactorEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                  }
                `}
              >
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaBell className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold">Security Notifications</h3>
            </div>

            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {key === 'email' && <FaEnvelope className="h-5 w-5 text-gray-400" />}
                    {key === 'sms' && <FaMobile className="h-5 w-5 text-gray-400" />}
                    {key === 'browser' && <FaBell className="h-5 w-5 text-gray-400" />}
                    <span className="text-sm capitalize">{key} Notifications</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => setNotifications({...notifications, [key]: !value})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Security Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <FaHistory className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold">Recent Security Activity</h3>
          </div>

          <div className="space-y-4">
            {securityLogs.map((log) => (
              <div key={log.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium">{log.action}</span>
                  <span className="text-xs text-gray-500">{log.date}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <p>{log.location}</p>
                  <p>{log.device}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {showPasswordModal && <PasswordChangeModal />}
    </div>
  )
}
