import { useState } from "react";
import axios from "axios";
import api from "../api";

const AddUserForm = ({ onUserAdded }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", address: "", role: "normal_user" });
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });


    if (formData.name.length < 20 || formData.name.length > 60) {
      setStatus({ type: "error", msg: "Name must be 20-60 chars." });
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,16})/;
    if (!passwordRegex.test(formData.password)) {
      setStatus({ type: "error", msg: "Password invalid (8-16 chars, 1 Upper, 1 Special)." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.post("/api/admin/users", formData, { headers: { Authorization: `Bearer ${token}` } });
      setStatus({ type: "success", msg: "User created successfully!" });
      setFormData({ name: "", email: "", password: "", address: "", role: "normal_user" });
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to add user" });
    }
  };

  const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border";

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Add New User</h3>
      
      {status.msg && (
        <div className={`p-4 rounded-md mb-4 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Full Name (20-60 chars)</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. System Administrator Account" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className={inputClass} placeholder="Strong@123" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className={inputClass}>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea name="address" rows="2" value={formData.address} onChange={handleChange} className={inputClass} />
        </div>


        <div className="md:col-span-2">
          <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};
export default AddUserForm;