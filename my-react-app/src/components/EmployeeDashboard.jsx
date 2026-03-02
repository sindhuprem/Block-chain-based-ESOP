import React from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {

  const navigate = useNavigate();
  const employeeName = "Naveena";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

        {/* Left side */}
        <div className="flex items-center space-x-6">

          <h1 className="text-xl font-bold text-primary-600">
            EMPLOYEE DASHBOARD
          </h1>

          <button
            className="nav-link"
            onClick={() => navigate("/employee-dashboard")}
          >
            Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/my-grants")}
          >
            My Grants
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/exercise")}
          >
            Exercise
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className="nav-link text-red-500"
            onClick={() => navigate("/")}
          >
            Logout
          </button>

        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">

          <Bell
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate("/notifications")}
          />

          <div className="flex items-center space-x-2">

            <User
              className="w-6 h-6 cursor-pointer"
              onClick={() => navigate("/profile")}
            />

            <span>{employeeName}</span>

          </div>

        </div>

      </nav>


      {/* Main Content */}
      <div className="p-6">

        {/* Welcome */}
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {employeeName}
        </h2>


        {/* Equity Summary */}
        <div className="grid grid-cols-3 gap-6 mb-6">

          <div className="card">
            <p>Total Granted Shares</p>
            <h3 className="text-xl font-bold">10,000</h3>
          </div>

          <div className="card">
            <p>Vested Shares</p>
            <h3 className="text-xl font-bold">4,000</h3>

            <div className="progress-bar mt-2">
            <div className="progress-bar-fill w-2/5"></div>
        </div>

          </div>

          <div className="card">
            <p>Exercised Shares</p>
            <h3 className="text-xl font-bold">1,500</h3>
          </div>

          <div className="card">
            <p>Available to Exercise</p>
            <h3 className="text-xl font-bold">2,500</h3>
          </div>

          <div className="card">
            <p>Unvested Shares</p>
            <h3 className="text-xl font-bold">6,000</h3>
          </div>

          <div className="card">
            <p>Current Value ($)</p>
            <h3 className="text-xl font-bold">$12,000</h3>
          </div>

        </div>


        {/* Vesting Timeline */}
        <div className="card mb-6">

          <h3 className="text-lg font-bold mb-2">
            Vesting Timeline
          </h3>

          <div className="h-40 flex items-center justify-center text-gray-500">
            Graph will come here
          </div>

        </div>


        {/* Recent Activity */}
        <div className="card">

          <h3 className="text-lg font-bold mb-4">
            Recent Activity
          </h3>

          <table className="w-full">

            <thead>
              <tr className="text-left border-b">
                <th>Date</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Link</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td>10 Feb 2026</td>
                <td>Grant</td>
                <td>1000</td>
                <td
                  className="text-primary-600 cursor-pointer"
                  onClick={() => navigate("/my-grants")}
                >
                  View
                </td>
              </tr>

              <tr className="border-b">
                <td>05 Jan 2026</td>
                <td>Exercise</td>
                <td>500</td>
                <td
                  className="text-primary-600 cursor-pointer"
                  onClick={() => navigate("/exercise")}
                >
                  View
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default EmployeeDashboard;
