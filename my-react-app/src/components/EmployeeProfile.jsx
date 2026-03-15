import React, { useState, useEffect } from "react";
import "./EmployeeProfile.css";
import { useAuth } from "../AuthContext";

const BASE_URL = "http://localhost:5000";

const EmployeeProfile = () => {
  const { user } = useAuth();

  const [employee, setEmployee] = useState({
    name: "", email: "", role: "", employeeId: "",
    department: "", phone: "", location: "", joinDate: "",
    status: "active", skills: [], wallet_address: ""
  });

  const [grants, setGrants] = useState([]);
  const [editMode, setEditMode] = useState(false);

  // Load real user data from auth context
  useEffect(() => {
    if (user) {
      setEmployee({
        name: user.name || "",
        email: user.email || "",
        role: user.role === "hr" ? "HR Manager" : user.role === "admin" ? "Admin" : "Employee",
        employeeId: `EMP${String(user.id).padStart(4, "0")}`,
        department: user.department || "—",
        phone: "+91 0000000000",
        location: "India",
        joinDate: user.created_at
          ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
          : "—",
        status: user.status || "active",
        skills: [],
        wallet_address: user.wallet_address || ""
      });
    }

    // Fetch real grants from blockchain
    if (user?.wallet_address) {
      fetch(`${BASE_URL}/api/grants/${user.wallet_address}`)
        .then(r => r.json())
        .then(data => {
          if (!data.error) setGrants(data);
        })
        .catch(() => {});
    }
  }, [user]);

  // Calculate ESOP stats from blockchain
  const totalShares = grants.reduce((s, g) => s + g.totalShares, 0);
  const vestedShares = grants.reduce((s, g) => s + g.vestedShares, 0);
  const exercisedShares = grants.reduce((s, g) => s + g.exercisedShares, 0);

  // Profile completion
  const completion = Math.round(
    Object.values(employee).filter(v => v !== "" && v !== null).length /
    Object.keys(employee).length * 100
  );

  const handleChange = (e) =>
    setEmployee({ ...employee, [e.target.name]: e.target.value });

  return (
    <div className="profile-page bg-gray-100 min-h-screen flex justify-center items-center p-6">
      <div className="profile-card bg-white shadow-xl rounded-xl p-8 w-full max-w-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Employee Profile</h1>
          <button
            onClick={() => setEditMode(!editMode)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editMode ? "Save" : "Edit"}
          </button>
        </div>

        {/* Avatar */}
        <div className="profile-avatar bg-blue-600 text-white text-3xl font-bold w-20 h-20 rounded-full flex items-center justify-center mb-4">
          {employee.name.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        {editMode ? (
          <input name="name" value={employee.name} onChange={handleChange}
            className="border p-2 rounded w-full mb-2" />
        ) : (
          <h2 className="profile-name text-xl font-bold">{employee.name}</h2>
        )}

        {/* Role */}
        <p className="profile-role text-gray-500 mb-3">{employee.role}</p>

        {/* Status Badge */}
        <span className={`inline-block px-3 py-1 rounded-full text-sm mb-4
          ${employee.status === "active"
            ? "bg-green-100 text-green-600"
            : "bg-yellow-100 text-yellow-600"}`}>
          {employee.status === "active" ? "Active" : "Pending"}
        </span>

        {/* Profile Completion */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-1">Profile Completion: {completion}%</p>
          <div className="w-full bg-gray-200 rounded h-2">
            <div className="bg-blue-600 h-2 rounded" style={{ width: `${completion}%` }}></div>
          </div>
        </div>

        {/* Details */}
        <div className="profile-details space-y-3">
          <ProfileRow label="Employee ID" value={employee.employeeId} />
          <ProfileRow label="Email" value={employee.email} />
          <ProfileRow label="Department" value={employee.department} />
          <ProfileRow label="Wallet Address" value={
            employee.wallet_address
              ? `${employee.wallet_address.slice(0, 6)}...${employee.wallet_address.slice(-4)}`
              : "Not linked"
          } />

          {editMode ? (
            <>
              <EditableRow label="Phone" name="phone" value={employee.phone} onChange={handleChange} />
              <EditableRow label="Location" name="location" value={employee.location} onChange={handleChange} />
            </>
          ) : (
            <>
              <ProfileRow label="Phone" value={employee.phone} />
              <ProfileRow label="Location" value={employee.location} />
            </>
          )}

          <ProfileRow label="Join Date" value={employee.joinDate} />
        </div>

        {/* ESOP Summary — from blockchain */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">
            ESOP Summary
            <span className="text-xs text-blue-500 font-normal ml-2">(from blockchain)</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard title="Granted" value={totalShares.toLocaleString()} color="blue" />
            <SummaryCard title="Vested" value={vestedShares.toLocaleString()} color="green" />
            <SummaryCard title="Exercised" value={exercisedShares.toLocaleString()} color="purple" />
          </div>
          {grants.length === 0 && (
            <p className="text-xs text-gray-400 mt-2 text-center">
              No grants yet — contact HR
            </p>
          )}
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h3 className="font-bold mb-2">Skills</h3>
          {employee.skills.length === 0 ? (
            <p className="text-sm text-gray-400">No skills added yet</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, i) => (
                <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const ProfileRow = ({ label, value }) => (
  <div className="profile-row flex justify-between border-b pb-1">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
);

const EditableRow = ({ label, name, value, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm text-gray-600">{label}</label>
    <input name={name} value={value} onChange={onChange} className="border p-2 rounded" />
  </div>
);

const SummaryCard = ({ title, value, color }) => (
  <div className={`bg-${color}-100 p-3 rounded text-center`}>
    <p className="text-sm">{title}</p>
    <h4 className={`font-bold text-${color}-600`}>{value}</h4>
  </div>
);

export default EmployeeProfile;