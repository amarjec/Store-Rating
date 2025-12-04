import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Signup from "./pages/SignUp";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/stores" element={<UserDashboard />} />
          
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;