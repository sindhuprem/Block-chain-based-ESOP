import React from "react";
import {
  Bell,
  Users,
  Database,
  FileText,
  BarChart3,
  ShieldCheck
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {

  const navigate = useNavigate();

  const adminName = "Naveena"; // later fetch from login/session

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

        {/* Left Side */}
        <div className="flex items-center space-x-6">

          <h1 className="text-xl font-bold text-blue-600">
            ADMIN DASHBOARD
          </h1>

          <button
            className="nav-link"
            onClick={() => navigate("/admin-dashboard")}
          >
            Dashboard
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/employees")}
          >
            Employees
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/esop-pool")}
          >
            ESOP Pool
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/grants")}
          >
            Grants
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/reports")}
          >
            Reports
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/settings")}
          >
            Settings
          </button>

          <button
            className="nav-link text-red-500"
            onClick={() => navigate("/")}
          >
            Logout
          </button>

        </div>


        {/* Right Side */}
        <div className="flex items-center space-x-4">

          <Bell
            className="w-6 h-6 cursor-pointer"
            onClick={() => navigate("/notifications")}
          />

          <div className="flex items-center space-x-2">

            <ShieldCheck className="w-6 h-6 text-blue-600" />

            <span className="font-medium">
              {adminName}
            </span>

          </div>

        </div>

      </nav>


      {/* Main Content */}
      <div className="p-6">

        {/* Welcome */}
        <h2 className="text-2xl font-bold mb-6">
          Welcome, {adminName}
        </h2>


        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">

          <div className="card">

            <Users className="text-blue-600 mb-2" />

            <p>Total Employees</p>

            <h3 className="text-xl font-bold">
              120
            </h3>

          </div>


          <div className="card">

            <Database className="text-green-600 mb-2" />

            <p>Total ESOP Pool</p>

            <h3 className="text-xl font-bold">
              1,000,000
            </h3>

          </div>


          <div className="card">

            <BarChart3 className="text-blue-600 mb-2" />

            <p>Allocated ESOP</p>

            <h3 className="text-xl font-bold">
              750,000
            </h3>

          </div>


          <div className="card">

            <FileText className="text-purple-600 mb-2" />

            <p>Remaining ESOP</p>

            <h3 className="text-xl font-bold">
              250,000
            </h3>

          </div>

        </div>


        {/* ESOP Pool Usage */}
        <div className="card mb-6">

          <h3 className="text-lg font-bold mb-4">
            ESOP Pool Usage
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: "75%" }}
            ></div>

          </div>

          <p className="mt-2 text-sm text-gray-600">
            75% of ESOP Pool Allocated
          </p>

        </div>


        {/* Employee Management Table */}
        <div className="card mb-6">

          <h3 className="text-lg font-bold mb-4">
            Employee Management
          </h3>

          <table className="w-full">

            <thead>

              <tr className="border-b text-left">

                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              <tr className="border-b">

                <td>Naveena</td>
                <td>naveena@email.com</td>
                <td>Employee</td>

                <td className="text-green-600">
                  Active
                </td>

                <td>

                  <button
                    className="text-blue-600"
                    onClick={() => navigate("/employee-details")}
                  >
                    View
                  </button>

                </td>

              </tr>


              <tr className="border-b">

                <td>Rahul</td>
                <td>rahul@email.com</td>
                <td>HR Manager</td>

                <td className="text-green-600">
                  Active
                </td>

                <td>

                  <button
                    className="text-blue-600"
                    onClick={() => navigate("/employee-details")}
                  >
                    View
                  </button>

                </td>

              </tr>


              <tr className="border-b">

                <td>Anita</td>
                <td>anita@email.com</td>
                <td>Employee</td>

                <td className="text-yellow-600">
                  Pending
                </td>

                <td>

                  <button
                    className="text-blue-600"
                    onClick={() => navigate("/approve-employee")}
                  >
                    Approve
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>


        {/* Recent Activity */}
        <div className="card">

          <h3 className="text-lg font-bold mb-4">
            Recent System Activity
          </h3>

          <table className="w-full">

            <thead>

              <tr className="border-b text-left">

                <th>Date</th>
                <th>Activity</th>
                <th>User</th>
                <th>Status</th>

              </tr>

            </thead>


            <tbody>

              <tr className="border-b">

                <td>10 Feb 2026</td>
                <td>Granted ESOP</td>
                <td>HR Manager</td>

                <td className="text-green-600">
                  Completed
                </td>

              </tr>


              <tr className="border-b">

                <td>08 Feb 2026</td>
                <td>New Employee Added</td>
                <td>Admin</td>

                <td className="text-green-600">
                  Completed
                </td>

              </tr>


              <tr className="border-b">

                <td>05 Feb 2026</td>
                <td>ESOP Pool Updated</td>
                <td>Admin</td>

                <td className="text-green-600">
                  Completed
                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default AdminDashboard;
