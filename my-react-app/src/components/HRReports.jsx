import React, { useState } from "react";
import {
  Bell,
  User,
  Download,
  FileBarChart,
  Calendar,
  Filter
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const HRReports = () => {

  const navigate = useNavigate();

  const hrName = "Naveena";

  const [department, setDepartment] = useState("All");
  const [dateRange, setDateRange] = useState("Last 6 Months");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

        <div className="flex items-center space-x-6">

          <h1 className="text-xl font-bold text-primary-600">
            ESOP REPORTS
          </h1>

          <button className="nav-link" onClick={() => navigate("/hr-dashboard")}>
            Dashboard
          </button>

          <button className="nav-link" onClick={() => navigate("/hr-employees")}>
            Employees
          </button>

          <button className="nav-link" onClick={() => navigate("/grant-esop")}>
            Grant ESOP
          </button>

          <button className="nav-link" onClick={() => navigate("/hr-reports")}>
            Reports
          </button>

          <button className="nav-link text-red-500" onClick={() => navigate("/")}>
            Logout
          </button>

        </div>

        <div className="flex items-center space-x-4">
          <Bell className="w-6 h-6 cursor-pointer" />
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>{hrName}</span>
          </div>
        </div>

      </nav>


      {/* Report Content */}
      <div className="p-6">

        {/* Report Header */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileBarChart className="w-7 h-7 text-primary-600" />
              ESOP Analytics Report
            </h2>
            <p className="text-gray-500">
              View, analyze and export ESOP allocation and exercise reports
            </p>
          </div>

          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>

        </div>


        {/* Filters */}
        <div className="card mb-6">

          <div className="flex items-center gap-4 mb-4">

            <Filter className="text-gray-500" />

            <h3 className="font-bold text-lg">
              Report Filters
            </h3>

          </div>

          <div className="flex gap-6">

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Department
              </label>

              <select
                className="input-field"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option>All</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>HR</option>
              </select>
            </div>


            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Date Range
              </label>

              <select
                className="input-field"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last 1 Year</option>
              </select>
            </div>

          </div>

        </div>


        {/* Report Summary */}
        <div className="card mb-6">

          <h3 className="font-bold text-lg mb-4">
            Report Summary
          </h3>

          <div className="grid grid-cols-4 gap-6">

            <div>
              <p className="text-gray-500 text-sm">
                Total ESOP Granted
              </p>
              <p className="text-2xl font-bold">
                120,000
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Total Exercised
              </p>
              <p className="text-2xl font-bold text-green-600">
                45,000
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Pending Exercise
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                75,000
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">
                Utilization %
              </p>
              <p className="text-2xl font-bold text-blue-600">
                37.5%
              </p>
            </div>

          </div>

        </div>


        {/* Allocation Report Table */}
        <div className="card mb-6">

          <h3 className="font-bold text-lg mb-4">
            ESOP Allocation Report
          </h3>

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">
                <th>Employee</th>
                <th>Department</th>
                <th>Granted</th>
                <th>Exercised</th>
                <th>Pending</th>
                <th>Utilization</th>
              </tr>
            </thead>

            <tbody>

              <tr className="border-b">
                <td>Naveena</td>
                <td>Engineering</td>
                <td>10000</td>
                <td>1500</td>
                <td>8500</td>
                <td className="text-blue-600">15%</td>
              </tr>

              <tr className="border-b">
                <td>Rahul</td>
                <td>Marketing</td>
                <td>8000</td>
                <td>1000</td>
                <td>7000</td>
                <td className="text-blue-600">12.5%</td>
              </tr>

              <tr className="border-b">
                <td>Anita</td>
                <td>HR</td>
                <td>6000</td>
                <td>500</td>
                <td>5500</td>
                <td className="text-blue-600">8.3%</td>
              </tr>

            </tbody>

          </table>

        </div>


        {/* Report Footer */}
        <div className="text-sm text-gray-500 flex justify-between">

          <span>
            Generated on: 17 Feb 2026
          </span>

          <span>
            Generated by: HR Manager
          </span>

        </div>

      </div>

    </div>
  );
};

export default HRReports;
