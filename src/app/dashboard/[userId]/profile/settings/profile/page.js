"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { client } from "@/lib/contentful";
import { useParams } from "next/navigation";
import Head from 'next/head'
import Image from "next/image";
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
  FaLock,
} from "react-icons/fa";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [profileImage, setProfileImage] = useState("/avatar.png");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();

  // Update the getAvatarImage helper function
const getAvatarImage = (userData) => {
  if (userData?.profileImage?.startsWith('http') || userData?.profileImage?.startsWith('/')) {
    return userData.profileImage;
  }
  
  return userData?.gender?.toLowerCase() === 'female' 
    ? "/avatarfemale.webp" 
    : "/avatarmale.jpeg";
};


const getFullImageUrl = (userData) => {
  if (!userData?.profileImage) {
    return userData?.gender?.toLowerCase() === 'female' 
      ? "/avatarfemale.webp" 
      : "/avatarmale.jpeg";
  }
  
  if (userData.profileImage.startsWith('//')) {
    return `https:${userData.profileImage}`;
  }
  
  return userData.profileImage;
};


  const fetchUserProfile = async () => {
    try {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);

      const response = await client.getEntries({
        content_type: "userProfile",
        "fields.email": user.email,
        include: 2,
      });

      if (response.items.length > 0) {
        const userProfile = response.items[0];
        setUserData({
          firstName: userProfile.fields.firstName || "",
          lastName: userProfile.fields.lastName || "",
          email: userProfile.fields.email || "",
          phoneNumber: userProfile.fields.phoneNumber || "",
          country: userProfile.fields.country || "",
          city: userProfile.fields.city || "",
          accountType: userProfile.fields.accountType || "",
          accountStatus: userProfile.fields.accountStatus || "",
          kycStatus: userProfile.fields.kycStatus || "",
          gender: userProfile.fields.gender || "male", // Add gender field
          profileImage:
            userProfile.fields.profileImage?.fields?.file?.url ||
            (userProfile.fields.gender?.toLowerCase() === 'female' 
              ? "/avatarfemale.webp" 
              : "/avatarmale.jpeg"),
          walletAddresses: userProfile.fields.walletAddresses || {},
        });
        setProfileImage(
          userProfile.fields.profileImage?.fields?.file?.url ||
          (userProfile.fields.gender?.toLowerCase() === 'female' 
            ? "/avatarfemale.webp" 
            : "/avatarmale.jpeg")
        );
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const userString = localStorage.getItem("user");
      const user = JSON.parse(userString);

      const response = await client.getEntries({
        content_type: "userProfile",
        "fields.email": user.email,
      });

      if (response.items.length > 0) {
        const entry = response.items[0];
        await client.updateEntry(entry.sys.id, {
          fields: {
            firstName: { "en-US": userData.firstName },
            lastName: { "en-US": userData.lastName },
            phoneNumber: { "en-US": userData.phoneNumber },
            country: { "en-US": userData.country },
            city: { "en-US": userData.city },
          },
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create asset in Contentful
        const asset = await client.createAsset({
          fields: {
            title: { "en-US": `Profile Image - ${userData.email}` },
            description: { "en-US": "User profile image" },
            file: {
              "en-US": {
                contentType: file.type,
                fileName: file.name,
                upload: file,
              },
            },
          },
        });

        // Process and publish the asset
        await asset.processForAllLocales();
        await asset.publish();

        // Update user profile with new image
        const userResponse = await client.getEntries({
          content_type: "userProfile",
          "fields.email": userData.email,
        });

        if (userResponse.items.length > 0) {
          const entry = userResponse.items[0];
          await client.updateEntry(entry.sys.id, {
            fields: {
              ...entry.fields,
              profileImage: {
                "en-US": {
                  sys: {
                    type: "Link",
                    linkType: "Asset",
                    id: asset.sys.id,
                  },
                },
              },
            },
          });
        }

        // Update local state
        setProfileImage(URL.createObjectURL(file));
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
  };

  if (loading) {
    return <div></div>;
  }
  return (
    <>
    <Head>
      <title>{userData ? `${userData.firstName}'s Profile | Trade Finance` : 'Profile | Trade Finance'}</title>
      
      {/* Security Headers */}
      <meta name="robots" content="noindex, nofollow" />
      <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' https: data:; connect-src 'self' https://cdn.contentful.com" />
      <meta http-equiv="X-Frame-Options" content="DENY" />
      
      {/* Cache Control */}
      <meta http-equiv="Cache-Control" content="private, no-store, must-revalidate" />
      <meta http-equiv="Pragma" content="no-cache" />
      
      {/* Additional Security */}
      <meta http-equiv="X-Content-Type-Options" content="nosniff" />
      <meta http-equiv="Referrer-Policy" content="same-origin" />
    </Head>

    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-900 via-black to-red-900 p-6 md:p-10 rounded-2xl shadow-2xl mb-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 font-sans">
            Profile Settings
          </h1>
          <p className="text-sm md:text-lg text-red-100/80 font-light">
            Manage your account settings and preferences
          </p>
        </div>
  
        {/* Tabs Section */}
        <div className="bg-black/40 p-2 rounded-xl mb-4">
          <div className="flex space-x-2">
            {[
              { id: "personal", label: "Personal Info", icon: FaUser },
              { id: "security", label: "Security", icon: FaLock },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center space-x-3
                  px-4 py-3 text-sm md:text-base font-medium rounded-xl
                  transition-all duration-300 ease-in-out
                  ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
  
        {/* Main Content */}
        <div className="bg-white/95  rounded-2xl shadow-2xl p-6 md:p-8">
          {activeTab === "personal" && (
            <div className="space-y-8">
              {/* Profile Image Section */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative">
                  <Image
  src={getFullImageUrl(userData)}
  alt="Profile"
  width={300}
  height={300}
  className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-white"
/>
                    <label className="absolute bottom-2 right-2 p-2 bg-red-600 rounded-full cursor-pointer hover:bg-red-700 transition-colors duration-300">
                      <FaCamera className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </div>
  
              {/* User Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userData &&
                  Object.entries(userData).map(([key, value]) => {
                    if (key !== "profileImage" && key !== "walletAddresses") {
                      const displayValue = key === "dateOfBirth"
                        ? new Date(value).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : value;
  
                      return (
                        <div key={key} className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition-shadow duration-300">
                          <label className="text-xs md:text-sm font-semibold text-gray-600 uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => setUserData({...userData, [key]: e.target.value})}
                              className="w-full mt-2 px-4 py-2 text-sm md:text-base border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          ) : (
                            <p className="mt-2 text-xs md:text-base font-medium text-gray-800">
                              {displayValue}
                            </p>
                          )}
                        </div>
                      );
                    }
                  })}
              </div>
  
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 text-sm md:text-base font-medium text-gray-600 hover:text-gray-800 transition-colors duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 text-sm md:text-base font-medium text-white rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 text-sm md:text-base font-medium text-white rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FaEdit className="h-4 w-4 md:h-5 md:w-5" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          )}
  
          {/* Security Tab Content */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
                Security Settings
              </h3>
              <div className="space-y-4">
                {[
                  {
                    icon: FaKey,
                    title: "Change Password",
                    description: "Update your account password",
                    action: "Update"
                  },
                  {
                    icon: FaShieldAlt,
                    title: "KYC Status",
                    description: userData?.kycStatus || "Not Verified",
                    action: userData?.kycStatus === "Verified" ? "Verified" : "Verify Now"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <item.icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-base md:text-lg font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-sm md:text-base text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm md:text-base font-medium text-red-600 hover:text-red-700 transition-colors duration-300">
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
  
}
