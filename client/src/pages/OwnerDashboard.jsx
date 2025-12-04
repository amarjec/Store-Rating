import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import api from "../api";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/api/owner/dashboard", { headers: { Authorization: `Bearer ${token}` } });
        setData(res.data);
      } catch (err) { setError("No store data found."); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen bg-gray-50 pt-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Dashboard</h2>

        {error ? (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md border border-yellow-200">{error}</div>
        ) : (
          <>
            {/* Hero Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 mb-10">
              <div className="bg-indigo-600 px-6 py-4">
                <h1 className="text-2xl font-bold text-white">{data.storeName}</h1>
                <p className="text-indigo-100 text-sm">📍 {data.address}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-200">
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-gray-500 uppercase">Average Rating</p>
                  <p className="mt-2 text-4xl font-extrabold text-gray-900 flex justify-center items-center gap-2">
                    {data.averageRating} <span className="text-yellow-400 text-3xl">★</span>
                  </p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm font-medium text-gray-500 uppercase">Total Reviews</p>
                  <p className="mt-2 text-4xl font-extrabold text-gray-900">{data.ratingCount}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Customer Reviews</h3>
              </div>
              <div className="overflow-x-auto">
                {data.ratings.length === 0 ? (
                  <p className="p-6 text-gray-500 text-center">No reviews yet.</p>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.ratings.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.User.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.User.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              {item.rating} ★
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default OwnerDashboard;