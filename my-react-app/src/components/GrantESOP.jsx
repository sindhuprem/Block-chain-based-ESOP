import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, FileText } from "lucide-react";

const GrantESOP = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
    department: "",
    grantType: "ISO",
    shares: "",
    exercisePrice: "",
    vestingStart: "",
    vestingPeriod: "4 Years",
    cliff: "1 Year",
    grantReason: "",
    notes: ""
  });

  const [recentGrants, setRecentGrants] = useState([]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = (e) => {

    e.preventDefault();

    const newGrant = {
      ...formData,
      date: new Date().toLocaleDateString()
    };

    setRecentGrants([newGrant, ...recentGrants]);

    alert("ESOP granted successfully!");

    setFormData({
      employeeName: "",
      employeeEmail: "",
      department: "",
      grantType: "ISO",
      shares: "",
      exercisePrice: "",
      vestingStart: "",
      vestingPeriod: "4 Years",
      cliff: "1 Year",
      grantReason: "",
      notes: ""
    });

  };


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">

        <div className="flex items-center gap-4">

          <ArrowLeft
            className="cursor-pointer"
            onClick={() => navigate("/hr-dashboard")}
          />

          <h1 className="text-xl font-bold text-primary-600">
            Grant ESOP to Employee
          </h1>

        </div>

      </nav>


      <div className="p-6 grid grid-cols-2 gap-6">


        {/* Grant Form */}
        <div className="bg-white p-6 rounded shadow">

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus size={20}/>
            Grant Details
          </h2>


          <form onSubmit={handleSubmit} className="space-y-4">


            {/* Employee Name */}
            <div>
              <label className="block font-medium">
                Employee Name
              </label>

              <input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Email */}
            <div>
              <label className="block font-medium">
                Employee Email
              </label>

              <input
                type="email"
                name="employeeEmail"
                value={formData.employeeEmail}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Department */}
            <div>
              <label className="block font-medium">
                Department
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">Select Department</option>
                <option>Engineering</option>
                <option>Marketing</option>
                <option>HR</option>
                <option>Finance</option>
              </select>
            </div>


            {/* Grant Type */}
            <div>
              <label className="block font-medium">
                Grant Type
              </label>

              <select
                name="grantType"
                value={formData.grantType}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>ISO</option>
                <option>NSO</option>
                <option>RSU</option>
              </select>
            </div>


            {/* Shares */}
            <div>
              <label className="block font-medium">
                Number of Shares
              </label>

              <input
                type="number"
                name="shares"
                value={formData.shares}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Exercise Price */}
            <div>
              <label className="block font-medium">
                Exercise Price ($)
              </label>

              <input
                type="number"
                name="exercisePrice"
                value={formData.exercisePrice}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Vesting Start */}
            <div>
              <label className="block font-medium">
                Vesting Start Date
              </label>

              <input
                type="date"
                name="vestingStart"
                value={formData.vestingStart}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Vesting Period */}
            <div>
              <label className="block font-medium">
                Vesting Period
              </label>

              <select
                name="vestingPeriod"
                value={formData.vestingPeriod}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
                <option>4 Years</option>
              </select>
            </div>


            {/* Cliff */}
            <div>
              <label className="block font-medium">
                Cliff Period
              </label>

              <select
                name="cliff"
                value={formData.cliff}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              >
                <option>None</option>
                <option>6 Months</option>
                <option>1 Year</option>
              </select>
            </div>


            {/* Reason */}
            <div>
              <label className="block font-medium">
                Grant Reason
              </label>

              <input
                type="text"
                name="grantReason"
                value={formData.grantReason}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Notes */}
            <div>
              <label className="block font-medium">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
            </div>


            {/* Submit */}
            <button
              type="submit"
              className="bg-primary-600 text-white w-full p-2 rounded hover:bg-primary-700"
            >
              Grant ESOP
            </button>


          </form>

        </div>


        {/* Recent Grants */}
        <div className="bg-white p-6 rounded shadow">

          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FileText size={20}/>
            Recent Grants
          </h2>

          {recentGrants.length === 0 ? (
            <p className="text-gray-500">
              No grants issued yet
            </p>
          ) : (
            <table className="w-full">

              <thead>
                <tr className="border-b text-left">
                  <th>Name</th>
                  <th>Shares</th>
                  <th>Type</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {recentGrants.map((grant, index) => (
                  <tr key={index} className="border-b">
                    <td>{grant.employeeName}</td>
                    <td>{grant.shares}</td>
                    <td>{grant.grantType}</td>
                    <td>{grant.date}</td>
                  </tr>
                ))}

              </tbody>

            </table>
          )}

        </div>


      </div>

    </div>
  );
};

export default GrantESOP;
