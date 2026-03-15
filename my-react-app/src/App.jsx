import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

import LoginPage from "./components/LoginPage";

// Employee pages
import EmployeeDashboard from "./components/EmployeeDashboard";
import MyGrants from "./components/MyGrants";
import ExerciseShares from "./components/ExerciseShares";
import EmployeeProfile from "./components/EmployeeProfile";
import Notifications from "./components/Notifications";

// HR pages
import HRDashboard from "./components/HRDashboard";
import HREmployees from "./components/HREmployees";
import GrantESOP from "./components/GrantESOP";
import HRReports from "./components/HRReports";

// Admin pages
import AdminDashboard from "./components/AdminDashboard";

// Protected route — redirects to login if not authenticated
// If allowedRoles provided, also checks role
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Routes>

      {/* Login */}
      <Route path="/" element={<LoginPage />} />

      {/* Employee only */}
      <Route path="/employee-dashboard" element={<PrivateRoute allowedRoles={["employee"]}><EmployeeDashboard /></PrivateRoute>} />
      <Route path="/my-grants"          element={<PrivateRoute allowedRoles={["employee"]}><MyGrants /></PrivateRoute>} />
      <Route path="/exercise"           element={<PrivateRoute allowedRoles={["employee"]}><ExerciseShares /></PrivateRoute>} />
      <Route path="/profile"            element={<PrivateRoute allowedRoles={["employee"]}><EmployeeProfile /></PrivateRoute>} />
      <Route path="/notifications"      element={<PrivateRoute><Notifications /></PrivateRoute>} />

      {/* HR only */}
      <Route path="/hr-dashboard"  element={<PrivateRoute allowedRoles={["hr"]}><HRDashboard /></PrivateRoute>} />

      {/* HR + Admin shared */}
      <Route path="/hr-employees"  element={<PrivateRoute allowedRoles={["hr", "admin"]}><HREmployees /></PrivateRoute>} />
      <Route path="/grant-esop"    element={<PrivateRoute allowedRoles={["hr", "admin"]}><GrantESOP /></PrivateRoute>} />
      <Route path="/hr-reports"    element={<PrivateRoute allowedRoles={["hr", "admin"]}><HRReports /></PrivateRoute>} />

      {/* Admin only */}
      <Route path="/admin-dashboard" element={<PrivateRoute allowedRoles={["admin"]}><AdminDashboard /></PrivateRoute>} />

    </Routes>
  );
}

export default App;