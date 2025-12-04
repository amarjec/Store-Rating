import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const ChangePassword = () => {
  const [formData, setFormData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: "error", msg: "New passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("/api/change-password", 
        { oldPassword: formData.oldPassword, newPassword: formData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setStatus({ type: "success", msg: "Password changed successfully!" });
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to update password" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-10 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-900">Change Password</h2>
            <p className="text-sm text-gray-500 mt-1">Update your account security</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {status.msg && (
              <div className={`p-3 rounded text-sm ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {status.msg}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input 
                type="password" name="oldPassword" required 
                className={inputClass}
                value={formData.oldPassword} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input 
                type="password" name="newPassword" required 
                className={inputClass}
                value={formData.newPassword} onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">8-16 chars, 1 Uppercase, 1 Special Char.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                type="password" name="confirmPassword" required 
                className={inputClass}
                value={formData.confirmPassword} onChange={handleChange}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;