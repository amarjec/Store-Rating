import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import AddUserForm from "../components/AddUserForm";
import AddStoreForm from "../components/AddStoreForm";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]); 
  const [viewMode, setViewMode] = useState("users"); 
  const [formMode, setFormMode] = useState("user");  
  const [sortOrder, setSortOrder] = useState("ASC");
  const [filter, setFilter] = useState(""); 
  useEffect(() => {
    fetchDashboardData();
  }, [sortOrder]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const statsRes = await axios.get("/api/admin/dashboard", config);
      setStats(statsRes.data);
      

      const usersRes = await axios.get(`/api/admin/users?sortBy=name&order=${sortOrder}`, config);
      setUsers(usersRes.data);


      const storesRes = await axios.get("/api/admin/stores", config);
      setStores(storesRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  const storeOwners = users.filter(u => u.role === 'store_owner');


  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(filter.toLowerCase()) || 
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.includes(filter.toLowerCase())
  );

  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.address.toLowerCase().includes(filter.toLowerCase())
  );

  const StatCard = ({ title, value, color }) => (
    <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color}`}>
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8 px-4 sm:px-0">
          <StatCard title="Total Users" value={stats.users} color="border-blue-500" />
          <StatCard title="Total Stores" value={stats.stores} color="border-green-500" />
          <StatCard title="Total Ratings" value={stats.ratings} color="border-yellow-500" />
        </div>


        <div className="px-4 sm:px-0 mb-6 bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex space-x-8 mb-4 border-b pb-4 ml-4">
                <button onClick={() => setFormMode("user")} className={`font-medium text-sm ${formMode === 'user' ? 'text-white py-2 px-4 bg-indigo-600 rounded-full'  : 'text-gray-500'}`}>Add User</button>
                <button onClick={() => setFormMode("store")} className={`font-medium text-sm ${formMode === 'store' ? 'text-white py-2 px-4 bg-green-600 rounded-full' : 'text-gray-500'}`}>Add Store</button>
            </div>
            {formMode === "user" ? (
                <AddUserForm onUserAdded={fetchDashboardData} />
            ) : (
                <AddStoreForm owners={storeOwners} onStoreAdded={fetchDashboardData} />
            )}
        </div>


        <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-4 sm:mx-0">

          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            

            <div className="flex space-x-2">
                <button 
                    onClick={() => setViewMode("users")} 
                    className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'users' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    View Users
                </button>
                <button 
                    onClick={() => setViewMode("stores")} 
                    className={`px-3 py-1 rounded text-sm font-medium ${viewMode === 'stores' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    View Stores
                </button>
            </div>


            <input 
                type="text" 
                placeholder="Filter by Name, Email, Role..." 
                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />

            <button onClick={() => setSortOrder(prev => prev === "ASC" ? "DESC" : "ASC")} className="text-xs text-gray-500 hover:text-gray-700">
              Sort {sortOrder === 'ASC' ? '↓' : '↑'}
            </button>
          </div>

          <div className="overflow-x-auto">
            {viewMode === "users" ? (
                // --- USERS TABLE ---
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner Rating</th> {/* Requirement Met */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                            <div className="text-xs text-gray-500 font-normal">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' : user.role === 'store_owner' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {user.role.replace('_', ' ')}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">

                            {user.role === 'store_owner' && user.ownerRating 
                                ? <span className="text-yellow-600">{parseFloat(user.ownerRating).toFixed(1)} ★</span> 
                                : <span className="text-gray-300">-</span>
                            }
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{user.address}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            ) : (
                // --- STORES TABLE  ---
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStores.map((store) => (
                    <tr key={store.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-yellow-600">
                            {parseFloat(store.overallRating || 0).toFixed(1)} ★
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{store.address}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;