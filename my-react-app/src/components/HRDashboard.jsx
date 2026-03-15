import React, { useEffect, useState } from "react";
import { Bell, Users, UserCheck, FileText, BarChart3, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchEmployees, fetchPoolInfo } from "../api";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const hrName = user?.name || "HR Manager";

  const [employees, setEmployees] = useState([]);
  const [poolInfo, setPoolInfo] = useState({ availablePool: 0 });
  const [allGrants, setAllGrants] = useState([]);

  useEffect(() => {
    // Fetch employees from SQLite (name, email, dept only)
    fetchEmployees().then(setEmployees).catch(() => {});

    // Fetch pool info from blockchain
    fetchPoolInfo().then(setPoolInfo).catch(() => {});

    // Fetch all grants from blockchain
    fetch(`${BASE_URL}/api/grants/all`)
      .then(r => r.json())
      .then(setAllGrants)
      .catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const poolTotal = 1000000;
  const poolUsedPct = poolTotal > 0
    ? (((poolTotal - poolInfo.availablePool) / poolTotal) * 100).toFixed(0)
    : 0;

  // Calculate total granted shares per employee from blockchain
  const grantsByAddress = {};
  allGrants.forEach(g => {
    const addr = g.employeeAddress?.toLowerCase();
    if (!grantsByAddress[addr]) grantsByAddress[addr] = 0;
    grantsByAddress[addr] += g.totalShares;
  });

  const esopHolders = employees.filter(e =>
    e.wallet_address && grantsByAddress[e.wallet_address.toLowerCase()] > 0
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-600">HR MANAGER DASHBOARD</h1>
          {[
            { label: "Dashboard", path: "/hr-dashboard" },
            { label: "Employees", path: "/hr-employees" },
            { label: "Grant ESOP", path: "/grant-esop" },
            { label: "Reports", path: "/hr-reports" },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`font-medium ${path === "/hr-dashboard" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
              {label}
            </button>
          ))}
          <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 cursor-pointer" />
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6" /><span>{hrName}</span>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Welcome, {hrName}</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded shadow p-4">
            <Users className="text-blue-600 mb-2" />
            <p className="text-gray-500">Total Employees</p>
            <h3 className="text-xl font-bold">{employees.length}</h3>
            <p className="text-xs text-gray-400">from database</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <UserCheck className="text-green-600 mb-2" />
            <p className="text-gray-500">Active ESOP Holders</p>
            <h3 className="text-xl font-bold">{esopHolders}</h3>
            <p className="text-xs text-gray-400">from blockchain</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <FileText className="text-blue-600 mb-2" />
            <p className="text-gray-500">Available Pool</p>
            <h3 className="text-xl font-bold">{poolInfo.availablePool?.toLocaleString()}</h3>
            <p className="text-xs text-gray-400">from blockchain</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <BarChart3 className="text-purple-600 mb-2" />
            <p className="text-gray-500">Pool Used</p>
            <h3 className="text-xl font-bold">{poolUsedPct}%</h3>
            <p className="text-xs text-gray-400">from blockchain</p>
          </div>
        </div>

        {/* Employee table — SQLite for info, Blockchain for shares */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="text-lg font-bold mb-4">Employee ESOP Overview</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>
                  Granted Shares
                  <span className="text-xs text-blue-500 ml-1">(blockchain)</span>
                </th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employees.filter(e => e.role === "employee").map((emp, i) => {
                const shares = emp.wallet_address
                  ? (grantsByAddress[emp.wallet_address.toLowerCase()] || 0)
                  : 0;
                return (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department || "—"}</td>
                    <td>{shares.toLocaleString()}</td>
                    <td className={emp.status === "active" ? "text-green-600" : "text-yellow-600"}>
                      {emp.status === "active" ? "Active" : "Pending"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded shadow p-4 text-center">
          <button onClick={() => navigate("/grant-esop")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4">
            + Grant ESOP
          </button>
          <button onClick={() => navigate("/hr-employees")}
            className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50">
            Manage Employees
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;