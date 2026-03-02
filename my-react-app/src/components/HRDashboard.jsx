import React from "react";
import {
  Bell,
  LogOut,
  Users,
  UserCheck,
  FileText,
  BarChart3,
  User
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const HRDashboard = () => {

  const hrName = "Naveena";

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

        {/* Left side */}
        <div className="flex items-center space-x-6">

          <h1 className="text-xl font-bold text-primary-600">
            HR MANAGER DASHBOARD
          </h1>

          {/* Dashboard */}
          <button
            className="nav-link"
            onClick={() => navigate("/hr-dashboard")}
          >
            Dashboard
          </button>

          {/* Employees */}
          <button
            className="nav-link"
            onClick={() => navigate("/hr-employees")}
          >
            Employees
          </button>

          {/* Grant ESOP */}
          <button
            className="nav-link"
            onClick={() => navigate("/grant-esop")}
          >
            Grant ESOP
          </button>

          {/* Reports */}
          <button
            className="nav-link"
            onClick={() => navigate("/hr-reports")}
          >
            Reports
          </button>

          {/* Logout */}
          <button
            className="nav-link text-red-500"
            onClick={() => navigate("/")}
          >
            Logout
          </button>

        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">

          <Bell className="w-6 h-6 cursor-pointer" />

          <div className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>{hrName}</span>
          </div>

        </div>

      </nav>


      {/* Main Content */}
      <div className="p-6">

        {/* Welcome */}
        <h2 className="text-2xl font-bold mb-6">
          Welcome, {hrName}
        </h2>


        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">

          <div className="card">
            <Users className="text-primary-600 mb-2" />
            <p>Total Employees</p>
            <h3 className="text-xl font-bold">120</h3>
          </div>

          <div className="card">
            <UserCheck className="text-green-600 mb-2" />
            <p>Active ESOP Holders</p>
            <h3 className="text-xl font-bold">95</h3>
          </div>

          <div className="card">
            <FileText className="text-blue-600 mb-2" />
            <p>Total Grants Issued</p>
            <h3 className="text-xl font-bold">300</h3>
          </div>

          <div className="card">
            <BarChart3 className="text-purple-600 mb-2" />
            <p>Total ESOP Pool Used</p>
            <h3 className="text-xl font-bold">75%</h3>
          </div>

        </div>


        {/* Employee Table */}
        <div className="card mb-6">

          <h3 className="text-lg font-bold mb-4">
            Employee ESOP Overview
          </h3>

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">
                <th>Name</th>
                <th>Email</th>
                <th>Granted Shares</th>
                <th>Vested</th>
                <th>Exercised</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td>Naveena</td>
                <td>naveena@email.com</td>
                <td>10000</td>
                <td>4000</td>
                <td>1500</td>
                <td className="text-green-600">Active</td>
              </tr>

              <tr className="border-b">
                <td>Rahul</td>
                <td>rahul@email.com</td>
                <td>8000</td>
                <td>3000</td>
                <td>1000</td>
                <td className="text-green-600">Active</td>
              </tr>

              <tr className="border-b">
                <td>Anita</td>
                <td>anita@email.com</td>
                <td>6000</td>
                <td>2000</td>
                <td>500</td>
                <td className="text-yellow-600">Pending</td>
              </tr>

            </tbody>

          </table>

        </div>


        {/* Recent Grants */}
        <div className="card">

          <h3 className="text-lg font-bold mb-4">
            Recent Grant Activity
          </h3>

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">
                <th>Date</th>
                <th>Employee</th>
                <th>Shares Granted</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td>10 Feb 2026</td>
                <td>Naveena</td>
                <td>1000</td>
                <td className="text-green-600">Approved</td>
              </tr>

              <tr className="border-b">
                <td>05 Feb 2026</td>
                <td>Rahul</td>
                <td>2000</td>
                <td className="text-green-600">Approved</td>
              </tr>

              <tr className="border-b">
                <td>01 Feb 2026</td>
                <td>Anita</td>
                <td>1500</td>
                <td className="text-yellow-600">Pending</td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default HRDashboard;
