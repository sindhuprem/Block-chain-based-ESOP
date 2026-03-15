import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Plus, Search, X } from "lucide-react";
import { fetchEmployees, createEmployee } from "../api";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const HREmployees = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const hrName = user?.name || "HR Manager";

  const [employees, setEmployees] = useState([]);
  const [allGrants, setAllGrants] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [newEmployee, setNewEmployee] = useState({
    name: "", email: "", role: "employee", password: "",
    department: "", wallet_address: "", status: "active"
  });

  useEffect(() => {
    fetchEmployees().then(setEmployees).catch(() => {});

    // Fetch grants from blockchain for granted shares column
    fetch(`${BASE_URL}/api/grants/all`)
      .then(r => r.json())
      .then(setAllGrants)
      .catch(() => {});
  }, []);

  // Calculate granted shares per wallet address from blockchain
  const grantsByAddress = {};
  allGrants.forEach(g => {
    const addr = g.employeeAddress?.toLowerCase();
    if (!grantsByAddress[addr]) grantsByAddress[addr] = 0;
    grantsByAddress[addr] += g.totalShares;
  });

  // Only show employees (not HR/Admin) and apply search
  const filtered = employees
    .filter(e => e.role === "employee")
    .filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
    );

  const handleChange = (e) =>
    setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const created = await createEmployee(newEmployee);
      setEmployees([...employees, created]);
      setShowModal(false);
      setSuccess("Employee added successfully!");
      setNewEmployee({ name: "", email: "", role: "employee", password: "", department: "", wallet_address: "", status: "active" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const roleLabel = (role) => {
    if (role === "hr") return "HR Manager";
    if (role === "admin") return "Admin";
    return "Employee";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-600">HR MANAGER DASHBOARD</h1>
          {[
            { label: "Dashboard", path: user?.role === "admin" ? "/admin-dashboard" : "/hr-dashboard" },
            { label: "Employees", path: "/hr-employees" },
            { label: "Grant ESOP", path: "/grant-esop" },
            { label: "Reports", path: "/hr-reports" },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`font-medium ${path === "/hr-employees" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
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
        {/* Title + Add Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Employee Management</h2>
          <button onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
            <Plus size={18} /> Add Employee
          </button>
        </div>

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">✅ {success}</div>
        )}

        {/* Search */}
        <div className="bg-white rounded shadow p-3 mb-6">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Search className="text-gray-400" />
            <input type="text" placeholder="Search employee..."
              className="ml-2 w-full outline-none"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded shadow p-4">
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">
                    No employees found
                  </td>
                </tr>
              ) : (
                filtered.map((emp, i) => {
                  const shares = emp.wallet_address
                    ? (grantsByAddress[emp.wallet_address.toLowerCase()] || 0)
                    : 0;
                  return (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 font-medium">{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.department || "—"}</td>
                      <td className={shares > 0 ? "text-blue-600 font-medium" : "text-gray-400"}>
                        {shares.toLocaleString()}
                      </td>
                      <td className={emp.status === "active" ? "text-green-600" : "text-yellow-600"}>
                        {emp.status === "active" ? "Active" : "Pending"}
                      </td>
                      <td className="space-x-2">
                        <button className="text-blue-600 hover:underline">View</button>
                        <button className="text-yellow-600 hover:underline">Edit</button>
                        <button className="text-red-600 hover:underline">Remove</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add New Employee</h3>
              <X className="cursor-pointer text-gray-500" onClick={() => setShowModal(false)} />
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-3">{error}</div>}

            <form onSubmit={handleAddEmployee} className="space-y-3">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Email", name: "email", type: "email" },
                { label: "Password", name: "password", type: "password" },
                { label: "Wallet Address (0x...)", name: "wallet_address", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input type={type} name={name} value={newEmployee[name]}
                    onChange={handleChange} required={name !== "wallet_address" && name !== "password"}
                    className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select name="department" value={newEmployee.department}
                  onChange={handleChange} required
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Select Department</option>
                  <option>Engineering</option>
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select name="role" value={newEmployee.role} onChange={handleChange}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="employee">Employee</option>
                  {user?.role === "admin" && (
                    <>
                      <option value="hr">HR Manager</option>
                      <option value="admin">Admin</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={newEmployee.status} onChange={handleChange}
                  className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60">
                  {loading ? "Adding..." : "Add Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HREmployees;