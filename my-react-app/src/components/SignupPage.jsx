import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);

    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;