import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import useThemeStore from "../store/themeStore";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const {
    user,
    fetchProfile,
    updateUserDetails,
    updateAvatar,
    updatePassword,
    initializeAuth,
    isLoading, // Get isLoading from store
  } = useAuthStore();
  const { darkMode } = useThemeStore();
  const [stats, setStats] = useState({ totalTodos: 0, completedTodos: 0 });
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    console.log("[Profile] User data updated:", user);
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
  }, [user?.username, user?.email, user?.avatar?.url]); // More specific dependencies

  useEffect(() => {
    const loadData = async () => {
      try {
        const isAuth = await initializeAuth();
        if (isAuth) {
          const { stats } = await fetchProfile();
          setStats(stats);
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };
    loadData();
  }, [initializeAuth, fetchProfile]);

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails(formData);
      toast.success("Profile updated successfully");
      // Get fresh stats after update
      const { stats } = await fetchProfile();
      setStats(stats);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) {
      toast.error("Please select an image file");
      return;
    }
    try {
      await updateAvatar(avatarFile);
      toast.success("Avatar updated successfully");
      setAvatarFile(null);
    } catch (error) {
      toast.error(error.message || "Failed to update avatar");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePassword(passwordData);
      toast.success("Password updated successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast.error(error.message); // Show actual error message
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <img
            src={user?.avatar?.url || "/default-avatar.png"}
            className="w-32 h-32 rounded-full mx-auto mb-4"
            alt="Avatar"
          />
          <h1 className="text-2xl font-bold">{user?.username}</h1>
          <p className="text-gray-500">{user?.email}</p>
          <div className="mt-4">
            <span className="mr-4">Total Todos: {stats.totalTodos}</span>
            <span>Completed: {stats.completedTodos}</span>
          </div>
        </div>

        {/* Update Sections */}
        <div className="space-y-8">
          {/* Update Details */}
          <form
            onSubmit={handleDetailsSubmit}
            className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                placeholder="Username"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`p-2 rounded ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                placeholder="Email"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Update Details
            </button>
          </form>

          {/* Update Avatar */}
          <form
            onSubmit={handleAvatarSubmit}
            className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <h2 className="text-xl font-semibold mb-4">Update Avatar</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className={`mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Update Avatar
            </button>
          </form>

          {/* Update Password */}
          <form
            onSubmit={handlePasswordSubmit}
            className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="space-y-4">
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className={`p-2 rounded w-full ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                placeholder="Current Password"
              />
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className={`p-2 rounded w-full ${darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
                placeholder="New Password"
              />
            </div>
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
