import React, { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const employeeName = user?.name || "Employee";

  const [stats, setStats] = useState({
    totalGranted: 0, vested: 0, exercised: 0,
    available: 0, unvested: 0
  });
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.wallet_address) {
      fetch(`${BASE_URL}/api/grants/${user.wallet_address}`)
        .then(r => r.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          setGrants(data);
          const totalGranted = data.reduce((s, g) => s + g.totalShares, 0);
          const vested      = data.reduce((s, g) => s + g.vestedShares, 0);
          const exercised   = data.reduce((s, g) => s + g.exercisedShares, 0);
          setStats({
            totalGranted, vested, exercised,
            available: vested - exercised,
            unvested: totalGranted - vested
          });
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setStats({ totalGranted: 0, vested: 0, exercised: 0, available: 0, unvested: 0 });
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold text-blue-600">EMPLOYEE DASHBOARD</h1>
          {[
            { label: "Dashboard", path: "/employee-dashboard" },
            { label: "My Grants", path: "/my-grants" },
            { label: "Exercise", path: "/exercise" },
            { label: "Profile", path: "/profile" },
          ].map(({ label, path }) => (
            <button key={path} onClick={() => navigate(path)}
              className={`font-medium ${path === "/employee-dashboard" ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}`}>
              {label}
            </button>
          ))}
          <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
        </div>
        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 cursor-pointer" onClick={() => navigate("/notifications")} />
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 cursor-pointer" onClick={() => navigate("/profile")} />
            <span>{employeeName}</span>
          </div>
        </div>
      </nav>

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome, {employeeName}</h2>

        {error && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-4">
            ⚠️ Could not load blockchain data: {error}
          </div>
        )}

        {!user?.wallet_address && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4">
            ℹ️ No wallet address linked to your account. Contact HR to link your wallet.
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading your equity data from blockchain...
          </div>
        ) : (
          <>
            {/* Stats Cards — all from blockchain */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              {[
                { label: "Total Granted Shares", value: stats.totalGranted.toLocaleString() },
                {
                  label: "Vested Shares",
                  value: stats.vested.toLocaleString(),
                  bar: stats.totalGranted > 0 ? stats.vested / stats.totalGranted : 0
                },
                { label: "Exercised Shares", value: stats.exercised.toLocaleString() },
                { label: "Available to Exercise", value: stats.available.toLocaleString() },
                { label: "Unvested Shares", value: stats.unvested.toLocaleString() },
                { label: "Current Value ($)", value: `$${(stats.available * 18).toLocaleString()}` },
              ].map(({ label, value, bar }) => (
                <div key={label} className="bg-white rounded shadow p-4">
                  <p className="text-gray-500 text-sm">{label}</p>
                  <h3 className="text-xl font-bold">{value}</h3>
                  {bar !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${Math.min(bar * 100, 100)}%` }}></div>
                    </div>
                  )}
                  <p className="text-xs text-blue-400 mt-1">from blockchain</p>
                </div>
              ))}
            </div>

            {/* Vesting Timeline */}
            <div className="bg-white rounded shadow p-4 mb-6">
              <h3 className="text-lg font-bold mb-2">Vesting Timeline</h3>
              <div className="h-40 flex items-center justify-center text-gray-400">
                Graph coming soon
              </div>
            </div>

            {/* Recent Activity — real blockchain grants */}
            <div className="bg-white rounded shadow p-4">
              <h3 className="text-lg font-bold mb-4">
                My Grants
                <span className="text-xs text-blue-500 font-normal ml-2">(from blockchain)</span>
              </h3>
              {grants.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No grants found. Contact HR to receive your ESOP grant.
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Grant Date</th>
                      <th>Total Shares</th>
                      <th>Vested</th>
                      <th>Exercised</th>
                      <th>Available</th>
                      <th>Status</th>
                      <th>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grants.map((g, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="py-2">
                          {g.grantDate ? new Date(g.grantDate * 1000).toLocaleDateString() : "—"}
                        </td>
                        <td className="font-medium">{g.totalShares?.toLocaleString()}</td>
                        <td className="text-blue-600">{g.vestedShares?.toLocaleString()}</td>
                        <td className="text-green-600">{g.exercisedShares?.toLocaleString()}</td>
                        <td className="text-purple-600">
                          {((g.vestedShares || 0) - (g.exercisedShares || 0)).toLocaleString()}
                        </td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold
                            ${!g.isActive
                              ? "bg-gray-100 text-gray-600"
                              : g.vestedShares === 0
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"}`}>
                            {!g.isActive ? "Inactive" : g.vestedShares === 0 ? "Pending" : "Active"}
                          </span>
                        </td>
                        <td className="text-blue-600 cursor-pointer hover:underline"
                          onClick={() => navigate("/my-grants")}>
                          View
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;