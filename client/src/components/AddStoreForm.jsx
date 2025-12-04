import { useState } from "react";
import api from "../api";

const AddStoreForm = ({ owners, onStoreAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: ""
  });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    if (!formData.ownerId) {
      setStatus({ type: "error", msg: "Please select a Store Owner." });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/api/admin/stores", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStatus({ type: "success", msg: "Store created successfully!" });
      setFormData({ name: "", email: "", address: "", ownerId: "" });
      
      if (onStoreAdded) onStoreAdded();
      
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.message || "Failed to create store" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm p-2";

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4 border-b pb-2">Add New Store</h3>
      
      {status.msg && (
        <div className={`p-4 rounded-md mb-4 ${status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Store Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Name</label>
          <input 
            type="text" name="name" 
            value={formData.name} onChange={handleChange} 
            className={inputClass} required 
          />
        </div>


        {/* Store Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Store Email</label>
          <input 
            type="email" name="email" 
            value={formData.email} onChange={handleChange} 
            className={inputClass} required 
          />
        </div>


        {/* Assign Owner */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Assign Owner</label>
          <select 
            name="ownerId" 
            value={formData.ownerId} 
            onChange={handleChange} 
            className={inputClass} 
            required
          >
            <option value="">-- Select a Store Owner --</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Only users with role 'Store Owner' appear here.</p>
        </div>

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address (Max 400 chars)</label>
          <textarea 
            name="address" rows="2" 
            value={formData.address} onChange={handleChange} 
            className={inputClass} required 
          />
        </div>


        <div className="md:col-span-2">
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
          >
            {loading ? "Creating Store..." : "Create Store"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStoreForm;