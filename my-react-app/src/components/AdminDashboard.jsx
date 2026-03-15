import React, { useEffect, useState } from "react";
import { Bell, Users, Database, FileText, BarChart3, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const adminName = user?.name || "Admin";

  const [employees, setEmployees] = useState([]);
  const [allGrants, setAllGrants] = useState([]);
  const [poolInfo, setPoolInfo] = useState({ availablePool: 0 });

  useEffect(() => {
    fetch(`${BASE_URL}/api/employees`)
      .then(r => r.json()).then(setEmployees).catch(() => {});

    fetch(`${BASE_URL}/api/grants/all`)
      .then(r => r.json()).then(setAllGrants).catch(() => {});

    fetch(`${BASE_URL}/api/pool`)
      .then(r => r.json()).then(setPoolInfo).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  const totalPool = 1000000;
  const allocatedShares = totalPool - (poolInfo.availablePool || 0);
  const poolUsedPct = ((allocatedShares / totalPool) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-600">ADMIN DASHBOARD</h1>
          {[
            { label: "Dashboard", path: "/admin-dashboard" },
            { label: "Employees", path: "/hr-employees" },
            { label: "Grant ESOP", path: "/grant-esop" },
            { label: "Reports", path: "/hr-reports" },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`font-medium ${path === "/admin-dashboard" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
              {label}
            </button>
          ))}
          <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 cursor-pointer" onClick={() => navigate("/notifications")} />
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            <span className="font-medium">{adminName}</span>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Welcome, {adminName}</h2>

        {/* Overview Cards — real data */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded shadow p-4">
            <Users className="text-blue-600 mb-2" />
            <p className="text-gray-500">Total Employees</p>
            <h3 className="text-xl font-bold">{employees.filter(e => e.role === "employee").length}</h3>
            <p className="text-xs text-blue-400">from database</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <Database className="text-green-600 mb-2" />
            <p className="text-gray-500">Total ESOP Pool</p>
            <h3 className="text-xl font-bold">{totalPool.toLocaleString()}</h3>
            <p className="text-xs text-blue-400">from blockchain</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <BarChart3 className="text-blue-600 mb-2" />
            <p className="text-gray-500">Allocated ESOP</p>
            <h3 className="text-xl font-bold">{allocatedShares.toLocaleString()}</h3>
            <p className="text-xs text-blue-400">from blockchain</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <FileText className="text-purple-600 mb-2" />
            <p className="text-gray-500">Remaining ESOP</p>
            <h3 className="text-xl font-bold">{(poolInfo.availablePool || 0).toLocaleString()}</h3>
            <p className="text-xs text-blue-400">from blockchain</p>
          </div>
        </div>

        {/* ESOP Pool Usage — real % */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="text-lg font-bold mb-4">ESOP Pool Usage</h3>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${poolUsedPct}%` }}></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {poolUsedPct}% of ESOP Pool Allocated
            <span className="text-blue-500 text-xs ml-2">(from blockchain)</span>
          </p>
        </div>

        {/* Employee Management Table — real data */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="text-lg font-bold mb-4">Employee Management</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{emp.name}</td>
                  <td>{emp.email}</td>
                  <td className="capitalize">
                    {emp.role === "hr" ? "HR Manager" : emp.role === "admin" ? "Admin" : "Employee"}
                  </td>
                  <td className={emp.status === "active" ? "text-green-600" : "text-yellow-600"}>
                    {emp.status === "active" ? "Active" : "Pending"}
                  </td>
                  <td>
                    <button className="text-blue-600 hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Grant Activity — real blockchain data */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-lg font-bold mb-4">
            Recent Grant Activity
            <span className="text-xs text-blue-500 font-normal ml-2">(from blockchain)</span>
          </h3>
          {allGrants.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No grants yet</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Employee</th>
                  <th>Department</th>
                  <th>Shares Granted</th>
                  <th>Vested</th>
                  <th>Grant Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {allGrants.map((g, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2">{g.employeeName}</td>
                    <td>{g.department || "—"}</td>
                    <td className="font-medium">{g.totalShares?.toLocaleString()}</td>
                    <td className="text-green-600">{g.vestedShares?.toLocaleString()}</td>
                    <td className="text-gray-500 text-sm">
                      {g.grantDate ? new Date(g.grantDate * 1000).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${g.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {g.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;