import React, { useState, useEffect } from "react";
import { Bell, User, Download, FileBarChart, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const HRReports = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const hrName = user?.name || "HR Manager";

  const [allGrants, setAllGrants] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState("All");
  const [dateRange, setDateRange] = useState("Last 6 Months");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch grants from blockchain
    fetch(`${BASE_URL}/api/grants/all`)
      .then(r => r.json())
      .then(data => { setAllGrants(data); setLoading(false); })
      .catch(() => setLoading(false));

    // Fetch employees from SQLite for department info
    fetch(`${BASE_URL}/api/employees`)
      .then(r => r.json())
      .then(setEmployees)
      .catch(() => {});
  }, []);

  // Get unique departments from employees
  const departments = ["All", ...new Set(employees.map(e => e.department).filter(Boolean))];

  // Filter grants by department
  const filtered = allGrants.filter(g =>
    department === "All" || g.department === department
  );

  // Real summary from blockchain
  const totalGranted = filtered.reduce((s, g) => s + (g.totalShares || 0), 0);
  const totalVested = filtered.reduce((s, g) => s + (g.vestedShares || 0), 0);
  const totalExercised = filtered.reduce((s, g) => s + (g.exercisedShares || 0), 0);
  const pendingExercise = totalVested - totalExercised;
  const utilization = totalGranted > 0
    ? ((totalExercised / totalGranted) * 100).toFixed(1)
    : "0.0";

  const handleLogout = () => { logout(); navigate("/"); };

  const handleExport = () => {
    const rows = [
      ["Employee", "Department", "Total Shares", "Vested", "Exercised", "Pending", "Grant Date", "Status"],
      ...filtered.map(g => [
        g.employeeName,
        g.department || "—",
        g.totalShares,
        g.vestedShares,
        g.exercisedShares,
        g.vestedShares - g.exercisedShares,
        g.grantDate ? new Date(g.grantDate * 1000).toLocaleDateString() : "—",
        g.isActive ? "Active" : "Inactive"
      ])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `esop-report-${new Date().toLocaleDateString()}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-600">ESOP REPORTS</h1>
          {[
            { label: "Dashboard", path: user?.role === "admin" ? "/admin-dashboard" : "/hr-dashboard" },
            { label: "Employees", path: "/hr-employees" },
            { label: "Grant ESOP", path: "/grant-esop" },
            { label: "Reports", path: "/hr-reports" },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`font-medium ${path === "/hr-reports" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileBarChart className="w-7 h-7 text-blue-600" />
              ESOP Analytics Report
            </h2>
            <p className="text-gray-500">
              Real-time data from blockchain
              <span className="text-blue-500 ml-1 text-xs">(blockchain)</span>
            </p>
          </div>
          <button onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="text-gray-500" />
            <h3 className="font-bold text-lg">Report Filters</h3>
          </div>
          <div className="flex gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Department</label>
              <select className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={department} onChange={e => setDepartment(e.target.value)}>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date Range</label>
              <select className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={dateRange} onChange={e => setDateRange(e.target.value)}>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last 1 Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary — all from blockchain */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="font-bold text-lg mb-4">
            Report Summary
            <span className="text-xs text-blue-500 font-normal ml-2">(from blockchain)</span>
          </h3>
          {loading ? (
            <p className="text-gray-400">Loading from blockchain...</p>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Total ESOP Granted</p>
                <p className="text-2xl font-bold">{totalGranted.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Vested</p>
                <p className="text-2xl font-bold text-blue-600">{totalVested.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Exercised</p>
                <p className="text-2xl font-bold text-green-600">{totalExercised.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Exercise</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingExercise.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Allocation Table — all from blockchain */}
        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="font-bold text-lg mb-4">
            ESOP Allocation Report
            <span className="text-xs text-blue-500 font-normal ml-2">(from blockchain)</span>
          </h3>
          {loading ? (
            <p className="text-gray-400 text-center py-6">Loading from blockchain...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Employee</th>
                  <th>Department</th>
                  <th>Total Shares</th>
                  <th>Vested</th>
                  <th>Exercised</th>
                  <th>Pending</th>
                  <th>Grant Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-6 text-gray-400">
                      No grants found
                    </td>
                  </tr>
                ) : (
                  filtered.map((g, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{g.employeeName}</td>
                      <td>{g.department || "—"}</td>
                      <td className="font-medium">{g.totalShares?.toLocaleString()}</td>
                      <td className="text-blue-600">{g.vestedShares?.toLocaleString()}</td>
                      <td className="text-green-600">{g.exercisedShares?.toLocaleString()}</td>
                      <td className="text-yellow-600">
                        {((g.vestedShares || 0) - (g.exercisedShares || 0)).toLocaleString()}
                      </td>
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
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 flex justify-between">
          <span>Generated on: {new Date().toLocaleDateString()}</span>
          <span>Generated by: {hrName}</span>
        </div>
      </div>
    </div>
  );
};

export default HRReports;