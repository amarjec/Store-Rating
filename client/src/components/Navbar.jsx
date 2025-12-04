import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <div className="shrink-0 flex items-center">
            <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'store_owner' ? '/owner' : '/stores'} className="text-xl font-bold tracking-wider text-blue-400 hover:text-blue-300 transition">
              StoreRate
            </Link>
          </div>


          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300 hidden sm:block">
              Welcome, <span className="font-semibold text-white">{user?.name}</span>
            </span>
            <Link 
              to="/change-password"
              className="text-gray-300 hover:text-white text-sm font-medium transition"
            >
              Change Password
            </Link>

            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;