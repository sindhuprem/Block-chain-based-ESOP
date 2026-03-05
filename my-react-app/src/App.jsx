import { Routes, Route } from "react-router-dom";

// Home & Auth
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

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

function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Authentication */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Employee */}
      <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
      <Route path="/my-grants" element={<MyGrants />} />
      <Route path="/exercise" element={<ExerciseShares />} />
      <Route path="/profile" element={<EmployeeProfile />} />
      <Route path="/notifications" element={<Notifications />} />

      {/* HR */}
      <Route path="/hr-dashboard" element={<HRDashboard />} />
      <Route path="/hr-employees" element={<HREmployees />} />
      <Route path="/grant-esop" element={<GrantESOP />} />
      <Route path="/hr-reports" element={<HRReports />} />

      {/* Admin */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />

    </Routes>
  );
}

export default App;