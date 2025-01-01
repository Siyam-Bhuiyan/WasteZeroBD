"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserByEmail, updateUser } from "@/utils/db/actions";

// Simple Avatar Component
const Avatar = ({ src, fallback, size = "h-32 w-32" }) => (
  <div className={`${size} rounded-full overflow-hidden border-4 border-white shadow-xl`}>
    {src ? (
      <img src={src} alt="Profile" className="w-full h-full object-cover" />
    ) : (
      <div className="w-full h-full bg-green-100 text-green-700 flex items-center justify-center text-4xl">
        {fallback}
      </div>
    )}
  </div>
);

// Simple Button Component
const Button = ({ children, onClick, variant = "primary", disabled = false, className = "" }) => {
  const baseStyle = "px-4 py-2 rounded-lg flex items-center gap-2 font-medium";
  const variants = {
    primary: "bg-green-600 hover:bg-green-700 text-white disabled:bg-green-300",
    outline: "border border-gray-300 hover:bg-gray-50",
    destructive: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Simple Input Component
const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${className}`}
    {...props}
  />
);

// Simple Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
    location: "",
    joinDate: "",
    totalPoints: 0,
    wastesReported: 0,
    wastesCollected: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          const userData = await getUserByEmail(email);
          setUser(userData);
          setFormData({
            name: userData.name || "",
            email: userData.email || "",
            bio: userData.bio || "",
            phone: userData.phone || "",
            location: userData.location || "",
            joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
            totalPoints: userData.totalPoints || 0,
            wastesReported: userData.wastesReported || 0,
            wastesCollected: userData.wastesCollected || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load user data.");
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await updateUser(user.id, formData);
      setUser((prev) => ({ ...prev, ...formData }));
      setEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading user data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - User Info */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <div className="text-center pb-2">
              <div className="flex flex-col items-center space-y-4">
                <Avatar
                  src={user.avatar || `/api/placeholder/150/150`}
                  fallback={user.name?.charAt(0).toUpperCase() || "U"}
                />
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Eco Warrior
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 space-y-4">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">📍</span>
                {user.location || "Location not set"}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">📅</span>
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-2">📱</span>
                {user.phone || "Phone not set"}
              </div>
            </div>
          </Card>

          {/* Stats Card */}
          <Card className="mt-6 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">🏆</span>
                  <span className="text-gray-700">Total Points</span>
                </div>
                <span className="font-bold text-green-600">{formData.totalPoints}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span className="text-gray-700">Wastes Reported</span>
                </div>
                <span className="font-bold text-blue-600">{formData.wastesReported}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <span className="mr-2">🗑️</span>
                  <span className="text-gray-700">Wastes Collected</span>
                </div>
                <span className="font-bold text-purple-600">{formData.wastesCollected}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Profile */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
              {!editing && (
                <Button onClick={() => setEditing(true)} variant="outline">
                  ✏️ Edit Profile
                </Button>
              )}
            </div>
            {!editing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{formData.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{formData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{formData.phone || "Not provided"}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="text-gray-900">{formData.location || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-900">{formData.bio || "No bio provided"}</p>
                </div>
                <Button onClick={handleLogout} variant="destructive">
                  🚪 Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Enter your location"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    💾 {loading ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setEditing(false)}
                    variant="outline"
                  >
                    ❌ Cancel
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}