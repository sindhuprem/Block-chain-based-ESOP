import React, { useState } from "react";
import "./EmployeeProfile.css";

const EmployeeProfile = () => {

  // EXISTING employee object (kept)
  const [employee, setEmployee] = useState({
    name: "Naveena",
    email: "naveena@email.com",
    role: "Employee",
    employeeId: "EMP1024",
    department: "Devops Engineer",

    // NEW fields
    phone: "+91 9876543210",
    location: "Chennai, India",
    joinDate: "15 Jan 2024",
    status: "Active",
    skills: ["React", "JavaScript", "Node.js"],
    totalShares: 10000,
    vestedShares: 4000,
    exercisedShares: 1500
  });

  // EDIT MODE STATE
  const [editMode, setEditMode] = useState(false);

  // PROFILE COMPLETION %
  const completion =
    Math.round(
      (
        Object.values(employee).filter(v => v !== "").length /
        Object.keys(employee).length
      ) * 100
    );

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setEmployee({
      ...employee,
      [e.target.name]: e.target.value
    });

  };

  return (

    <div className="profile-page bg-gray-100 min-h-screen flex justify-center items-center p-6">

      <div className="profile-card bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">

          <h1 className="text-2xl font-bold">
            Employee Profile
          </h1>

          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editMode ? "Save" : "Edit"}
          </button>

        </div>


        {/* Avatar */}
        <div className="profile-avatar bg-blue-600 text-white text-3xl font-bold w-20 h-20 rounded-full flex items-center justify-center mb-4">

          {employee.name.charAt(0)}

        </div>


        {/* Name */}
        {editMode ? (

          <input
            name="name"
            value={employee.name}
            onChange={handleChange}
            className="border p-2 rounded w-full mb-2"
          />

        ) : (

          <h2 className="profile-name text-xl font-bold">
            {employee.name}
          </h2>

        )}


        {/* Role */}
        <p className="profile-role text-gray-500 mb-3">
          {employee.role}
        </p>


        {/* STATUS BADGE */}
        <span className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm mb-4">

          {employee.status}

        </span>


        {/* PROFILE COMPLETION */}
        <div className="mb-6">

          <p className="text-sm text-gray-600 mb-1">
            Profile Completion: {completion}%
          </p>

          <div className="w-full bg-gray-200 rounded h-2">

            <div
              className="bg-blue-600 h-2 rounded"
              style={{ width: `${completion}%` }}
            ></div>

          </div>

        </div>


        {/* DETAILS */}
        <div className="profile-details space-y-3">

          <ProfileRow label="Employee ID" value={employee.employeeId} />

          <ProfileRow label="Email" value={employee.email} />

          <ProfileRow label="Department" value={employee.department} />

          {/* NEW FIELDS */}

          {editMode ? (

            <>
              <EditableRow
                label="Phone"
                name="phone"
                value={employee.phone}
                onChange={handleChange}
              />

              <EditableRow
                label="Location"
                name="location"
                value={employee.location}
                onChange={handleChange}
              />
            </>

          ) : (

            <>
              <ProfileRow label="Phone" value={employee.phone} />

              <ProfileRow label="Location" value={employee.location} />
            </>

          )}

          <ProfileRow label="Join Date" value={employee.joinDate} />

        </div>


        {/* ESOP SUMMARY */}
        <div className="mt-6">

          <h3 className="font-bold mb-2">
            ESOP Summary
          </h3>

          <div className="grid grid-cols-3 gap-4">

            <SummaryCard
              title="Granted"
              value={employee.totalShares}
              color="blue"
            />

            <SummaryCard
              title="Vested"
              value={employee.vestedShares}
              color="green"
            />

            <SummaryCard
              title="Exercised"
              value={employee.exercisedShares}
              color="purple"
            />

          </div>

        </div>


        {/* SKILLS */}
        <div className="mt-6">

          <h3 className="font-bold mb-2">
            Skills
          </h3>

          <div className="flex flex-wrap gap-2">

            {employee.skills.map((skill, index) => (

              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>

            ))}

          </div>

        </div>


      </div>

    </div>

  );

};


/* PROFILE ROW COMPONENT */
const ProfileRow = ({ label, value }) => (

  <div className="profile-row flex justify-between border-b pb-1">

    <span className="text-gray-600">{label}</span>

    <span className="font-medium">{value}</span>

  </div>

);


/* EDITABLE ROW */
const EditableRow = ({ label, name, value, onChange }) => (

  <div className="flex flex-col">

    <label className="text-sm text-gray-600">
      {label}
    </label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      className="border p-2 rounded"
    />

  </div>

);


/* SUMMARY CARD */
const SummaryCard = ({ title, value, color }) => (

  <div className={`bg-${color}-100 p-3 rounded text-center`}>

    <p className="text-sm">{title}</p>

    <h4 className={`font-bold text-${color}-600`}>
      {value}
    </h4>

  </div>

);

export default EmployeeProfile;
