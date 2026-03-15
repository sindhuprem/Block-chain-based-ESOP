import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const MyGrants = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (user?.wallet_address) {
      fetch(`${BASE_URL}/api/grants/${user.wallet_address}`)
        .then(r => r.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          const mapped = data.map(g => ({
            id: g.grantId,
            date: g.grantDate
              ? new Date(g.grantDate * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })
              : "—",
            shares: g.totalShares,
            vestedShares: g.vestedShares,
            exercisedShares: g.exercisedShares,
            isActive: g.isActive,
            status: !g.isActive
              ? "Completed"
              : g.vestedShares === 0
              ? "Pending"
              : "Vesting",
            vested: g.totalShares > 0
              ? Math.round((g.vestedShares / g.totalShares) * 100)
              : 0,
          }));
          setGrants(mapped);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setGrants([]);
      setLoading(false);
    }
  }, [user]);

  const totalGranted = grants.reduce((s, g) => s + g.shares, 0);
  const totalVested = grants.reduce((s, g) => s + (g.vestedShares || 0), 0);
  const availableToExercise = grants.reduce((s, g) =>
    s + Math.max(0, (g.vestedShares || 0) - (g.exercisedShares || 0)), 0);

  const filteredGrants = grants.filter(g => {
    const matchesSearch = g.date.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || g.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return (
    <div className="p-6 text-center text-gray-500">
      Loading grants from blockchain...
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My ESOP Grants</h1>
        <p className="text-gray-500">
          Track your granted stock options and vesting progress.
          <span className="text-blue-500 text-xs ml-2">(from blockchain)</span>
        </p>
      </div>

      {error && (
        <div className="bg-yellow-50 text-yellow-700 p-3 rounded mb-4">
          ⚠️ {error}
        </div>
      )}

      {!user?.wallet_address && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4">
          ℹ️ No wallet address linked. Contact HR to link your wallet.
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Search by grant date..."
          className="border p-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search} onChange={e => setSearch(e.target.value)} />
        <select
          className="border p-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Vesting</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-gray-500">Total Granted</h3>
          <p className="text-2xl font-bold text-blue-600">{totalGranted.toLocaleString()}</p>
          <p className="text-xs text-blue-400 mt-1">from blockchain</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-gray-500">Total Vested</h3>
          <p className="text-2xl font-bold text-green-600">{totalVested.toLocaleString()}</p>
          <p className="text-xs text-blue-400 mt-1">from blockchain</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-gray-500">Available to Exercise</h3>
          <p className="text-2xl font-bold text-purple-600">{availableToExercise.toLocaleString()}</p>
          <p className="text-xs text-blue-400 mt-1">from blockchain</p>
        </div>
      </div>

      {/* Grants Table */}
      <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
        {grants.length === 0 ? (
          <p className="text-center py-8 text-gray-400">
            No grants found. Contact HR to receive your ESOP grant.
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-3 text-left">Grant Date</th>
                <th className="p-3 text-left">Total Shares</th>
                <th className="p-3 text-left">Vested</th>
                <th className="p-3 text-left">Exercised</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Progress</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrants.map(g => (
                <tr key={g.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{g.date}</td>
                  <td className="p-3 font-medium">{g.shares.toLocaleString()}</td>
                  <td className="p-3 text-blue-600">{g.vestedShares.toLocaleString()}</td>
                  <td className="p-3 text-green-600">{g.exercisedShares.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${g.status === "Completed" ? "bg-green-100 text-green-700"
                        : g.status === "Vesting" ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${g.vested}%` }}></div>
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap">{g.vested}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <button
                      disabled={g.vested === 0}
                      onClick={() => navigate("/exercise")}
                      className={`px-4 py-1 rounded text-white text-sm
                        ${g.vested === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"}`}>
                      Exercise
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyGrants;