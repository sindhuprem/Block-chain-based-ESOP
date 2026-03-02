import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Plus, Search } from "lucide-react";

const HREmployees = () => {

  const navigate = useNavigate();

  const hrName = "Naveena";

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

        <div className="flex items-center space-x-6">

          <h1 className="text-xl font-bold text-primary-600">
            HR MANAGER DASHBOARD
          </h1>

          <button
            className="nav-link"
            onClick={() => navigate("/hr-dashboard")}
          >
            Dashboard
          </button>

          <button
            className="nav-link text-primary-600 font-semibold"
          >
            Employees
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/grant-esop")}
          >
            Grant ESOP
          </button>

          <button
            className="nav-link"
            onClick={() => navigate("/hr-reports")}
          >
            Reports
          </button>

          <button
            className="nav-link text-red-500"
            onClick={() => navigate("/")}
          >
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


      {/* Main Content */}
      <div className="p-6">

        {/* Page Title */}
        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Employee Management
          </h2>

          <button className="btn-primary flex items-center gap-2 w-auto px-4 py-2">
            <Plus size={18} />
            Add Employee
          </button>

        </div>


        {/* Search */}
        <div className="card mb-6">

          <div className="flex items-center border rounded-lg px-3 py-2">

            <Search className="text-gray-400" />

            <input
              type="text"
              placeholder="Search employee..."
              className="ml-2 w-full outline-none"
            />

          </div>

        </div>


        {/* Employee Table */}
        <div className="card">

          <table className="w-full">

            <thead>
              <tr className="border-b text-left">

                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Granted Shares</th>
                <th>Status</th>
                <th>Action</th>

              </tr>
            </thead>

            <tbody>

              <tr className="border-b">

                <td className="py-2">Naveena</td>
                <td>naveena@email.com</td>
                <td>Engineering</td>
                <td>10,000</td>
                <td className="text-green-600">Active</td>

                <td className="space-x-2">

                  <button className="text-blue-600 hover:underline">
                    View
                  </button>

                  <button className="text-yellow-600 hover:underline">
                    Edit
                  </button>

                  <button className="text-red-600 hover:underline">
                    Remove
                  </button>

                </td>

              </tr>


              <tr className="border-b">

                <td className="py-2">Rahul</td>
                <td>rahul@email.com</td>
                <td>Finance</td>
                <td>8,000</td>
                <td className="text-green-600">Active</td>

                <td className="space-x-2">

                  <button className="text-blue-600 hover:underline">
                    View
                  </button>

                  <button className="text-yellow-600 hover:underline">
                    Edit
                  </button>

                  <button className="text-red-600 hover:underline">
                    Remove
                  </button>

                </td>

              </tr>


              <tr className="border-b">

                <td className="py-2">Anita</td>
                <td>anita@email.com</td>
                <td>HR</td>
                <td>6,000</td>
                <td className="text-yellow-600">Pending</td>

                <td className="space-x-2">

                  <button className="text-blue-600 hover:underline">
                    View
                  </button>

                  <button className="text-yellow-600 hover:underline">
                    Edit
                  </button>

                  <button className="text-red-600 hover:underline">
                    Remove
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default HREmployees;
