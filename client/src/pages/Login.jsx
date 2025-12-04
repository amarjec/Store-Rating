import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const performLogin = async (loginEmail, loginPassword) => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/login", { email: loginEmail, password: loginPassword });
      
      login(res.data);

      if (res.data.role === "admin") navigate("/admin");
      else if (res.data.role === "store_owner") navigate("/owner");
      else navigate("/stores");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to auto-fill and login for demo accounts
  const handleDemoLogin = (role) => {
    let demoEmail = "";
    const demoPass = "Password@123";

    if (role === "admin") demoEmail = "admin@test.com";
    if (role === "owner") demoEmail = "owner@test.com";
    if (role === "user") demoEmail = "user@test.com";

    setEmail(demoEmail);
    setPassword(demoPass);
    performLogin(demoEmail, demoPass);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to access your dashboard</p>
        </div>

        {/* --- DEMO BUTTONS SECTION --- */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-xs font-bold text-blue-800 uppercase mb-2 text-center">Recruiter Quick Access</p>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleDemoLogin('admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-2 rounded transition"
            >
              Admin Demo
            </button>
            <button 
              onClick={() => handleDemoLogin('owner')}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs py-2 px-2 rounded transition"
            >
              Owner Demo
            </button>
            <button 
              onClick={() => handleDemoLogin('user')}
              className="bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-2 rounded transition"
            >
              User Demo
            </button>
          </div>
        </div>
        {/* ---------------------------- */}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded text-sm">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:underline">Create free account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;