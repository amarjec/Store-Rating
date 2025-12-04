import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import api from "../api";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStores = async (searchTerm = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(`/api/stores?search=${searchTerm}`, { headers: { Authorization: `Bearer ${token}` } });
      setStores(res.data);
      setLoading(false);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStores(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchStores(e.target.value);
  };

  const submitRating = async (storeId, ratingValue) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/rating", { storeId, rating: ratingValue }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Rating submitted successfully!");
      fetchStores(search);
    } catch (err) { alert("Failed to submit rating"); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Store Listings</h2>
            <p className="mt-1 text-sm text-gray-500">Browse and rate your favorite stores.</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="🔍 Search name or address..." 
              value={search}
              onChange={handleSearch}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        {/* Store Grid */}
        {loading ? <p className="text-center text-gray-500">Loading...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col h-full">
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{store.name}</h3>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 font-bold text-sm">
                      ★ {parseFloat(store.overallRating || 0).toFixed(1)}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">📍 {store.address}</p>
                  <p className="text-gray-400 text-xs mt-1">📧 {store.email}</p>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rate This Store</span>
                    <StarRating 
                    rating={store.myRating || 0} 
                    onRate={(val) => submitRating(store.id, val)} 
                  />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default UserDashboard;