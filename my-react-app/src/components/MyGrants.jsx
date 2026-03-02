import React, { useState } from "react";
import "./MyGrants.css";

const MyGrants = () => {

  // Existing grants data
  const [grants] = useState([
    { id: 1, date: "Jan 2024", shares: 5000, status: "Vesting", vested: 40 },
    { id: 2, date: "Jan 2025", shares: 5000, status: "Pending", vested: 0 },
    { id: 3, date: "Jan 2023", shares: 3000, status: "Completed", vested: 100 },
  ]);

  // New Features: search and filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Dynamic summary calculations
  const totalGranted = grants.reduce((sum, g) => sum + g.shares, 0);

  const totalVested = grants.reduce(
    (sum, g) => sum + Math.floor((g.vested / 100) * g.shares),
    0
  );

  const availableToExercise = Math.floor(totalVested * 0.6);

  // Filter logic
  const filteredGrants = grants.filter((g) => {
    const matchesSearch =
      g.date.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || g.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (

    <div className="grants-page p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="grants-header mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          My ESOP Grants
        </h1>
        <p className="text-gray-500">
          Track your granted stock options and vesting progress.
        </p>
      </div>


      {/* NEW: Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search by grant date..."
          className="border p-2 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Vesting</option>
          <option>Completed</option>
        </select>

      </div>


      {/* Summary Cards */}
      <div className="grants-summary grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="summary-card bg-white shadow-md rounded-lg p-4">
          <h3 className="text-gray-500">Total Granted</h3>
          <p className="text-2xl font-bold text-blue-600">
            {totalGranted.toLocaleString()}
          </p>
        </div>

        <div className="summary-card bg-white shadow-md rounded-lg p-4">
          <h3 className="text-gray-500">Total Vested</h3>
          <p className="text-2xl font-bold text-green-600">
            {totalVested.toLocaleString()}
          </p>
        </div>

        <div className="summary-card bg-white shadow-md rounded-lg p-4">
          <h3 className="text-gray-500">Available to Exercise</h3>
          <p className="text-2xl font-bold text-purple-600">
            {availableToExercise.toLocaleString()}
          </p>
        </div>

      </div>


      {/* Table */}
      <div className="table-card bg-white shadow-md rounded-lg p-4 overflow-x-auto">

        <table className="grants-table w-full">

          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="p-3 text-left">Grant Date</th>
              <th className="p-3 text-left">Shares</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Progress</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredGrants.map((g) => (

              <tr
                key={g.id}
                className="border-t hover:bg-gray-50 transition"
              >

                <td className="p-3">{g.date}</td>

                <td className="p-3 font-medium">
                  {g.shares.toLocaleString()}
                </td>

                {/* Status */}
                <td className={`status ${g.status.toLowerCase()} p-3`}>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                      ${g.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : g.status === "Vesting"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {g.status}
                  </span>
                </td>


                {/* Progress */}
                <td className="p-3">

                  <div className="flex items-center gap-3">

                    <div className="progress-bar w-full bg-gray-200 rounded-full h-3">

                      <div
                        className="progress-fill bg-blue-500 h-3 rounded-full"
                        style={{ width: `${g.vested}%` }}
                      ></div>

                    </div>

                    <span className="text-sm font-medium">
                      {g.vested}%
                    </span>

                  </div>

                </td>


                {/* NEW: Exercise Button */}
                <td className="p-3">

                  <button
                    disabled={g.vested === 0}
                    className={`px-4 py-1 rounded text-white text-sm
                      ${
                        g.vested === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                  >
                    Exercise
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
};

export default MyGrants;
