"use client"
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FaUser, 
  FaEdit, 
  FaKey, 
  FaShieldAlt, 
  FaChartLine, 
  FaHistory,
  FaBell,
  FaCamera,
  FaCheck,
  FaLock
} from 'react-icons/fa'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [profileImage, setProfileImage] = useState('/default-avatar.png')
  
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    country: 'United States',
    city: 'New York',
    address: '123 Trading Street',
    dob: '1990-01-01',
    occupation: 'Trader',
    accountType: 'Premium'
  })

  const financialStats = {
    totalBalance: '$25,000',
    totalInvested: '$15,000',
    totalProfit: '$5,000',
    activeInvestments: 3,
    completedTrades: 45,
    successRate: '92%'
  }

  const recentActivities = [
    {
      id: 1,
      type: 'Investment',
      amount: '$5,000',
      date: '2024-01-15',
      status: 'Active'
    },
    {
      id: 2,
      type: 'Withdrawal',
      amount: '$2,500',
      date: '2024-01-14',
      status: 'Completed'
    },
    {
      id: 3,
      type: 'Deposit',
      amount: '$3,000',
      date: '2024-01-13',
      status: 'Completed'
    }
  ]

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    // Add save logic here
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-red-100"
          />
          <label className="absolute bottom-0 right-0 p-1 bg-red-600 rounded-full cursor-pointer">
            <FaCamera className="h-4 w-4 text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(userData).map(([key, value]) => (
          <div key={key} className="space-y-1">
            <label className="text-xs font-medium text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={value}
                onChange={(e) => setUserData({...userData, [key]: e.target.value})}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500"
              />
            ) : (
              <p className="text-sm font-medium">{value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        {isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="
                px-4 py-2 text-sm font-medium text-white rounded-lg
                bg-gradient-to-r from-red-600 to-red-800
                hover:from-red-700 hover:to-red-900
              "
            >
              Save Changes
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="
              inline-flex items-center space-x-2
              px-4 py-2 text-sm font-medium text-white rounded-lg
              bg-gradient-to-r from-red-600 to-red-800
              hover:from-red-700 hover:to-red-900
            "
          >
            <FaEdit className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  )

  const renderFinancialInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(financialStats).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-xs text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium">{activity.type}</p>
                <p className="text-xs text-gray-600">{activity.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{activity.amount}</p>
                <p className="text-xs text-green-600">{activity.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaKey className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Change Password</p>
                <p className="text-xs text-gray-600">Update your account password</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaShieldAlt className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-gray-600">Add extra security to your account</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700">
              Enable
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaBell className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Notification Settings</p>
                <p className="text-xs text-gray-600">Manage your notification preferences</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700">
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 via-red-800 to-black p-6 md:p-8 rounded-lg shadow-lg text-center mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-white tracking-wide mb-2">
          Profile Settings
        </h1>
        <p className="text-sm md:text-base text-red-100/80">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'personal', label: 'Personal Info', icon: FaUser },
          { id: 'financial', label: 'Financial', icon: FaChartLine },
          { id: 'security', label: 'Security', icon: FaLock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center space-x-2
              px-4 py-2 text-sm font-medium rounded-lg
              ${activeTab === tab.id
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'financial' && renderFinancialInfo()}
        {activeTab === 'security' && renderSecuritySettings()}
      </div>
    </div>
  )
}
