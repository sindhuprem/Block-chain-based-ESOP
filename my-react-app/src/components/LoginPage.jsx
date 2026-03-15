import React, { useState } from 'react';
import { Eye, EyeOff, Building2, Shield, Users, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: '', label: 'Select your role', icon: null },
    { value: 'employee', label: 'Employee', icon: User },
    { value: 'hr', label: 'HR Manager', icon: Users },
    { value: 'admin', label: 'Admin', icon: Shield }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    if (!formData.role) newErrors.role = 'Please select your role';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const data = await loginUser(formData.email, formData.password, formData.role);
      login(data.user);   // save user globally
      switch (formData.role) {
        case 'employee': navigate("/employee-dashboard"); break;
        case 'hr':       navigate("/hr-dashboard");       break;
        case 'admin':    navigate("/admin-dashboard");    break;
      }
    } catch (error) {
      setErrors({ submit: 'Login failed. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your ESOP Management Account</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                name="email" type="email" value={formData.email}
                onChange={handleInputChange} autoComplete="off"
                placeholder="Enter your email"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full border rounded px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.password ? 'border-red-500' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Role</label>
              <select name="role" value={formData.role} onChange={handleInputChange}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.role ? 'border-red-500' : ''}`}>
                {roleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
            </div>

            {/* Role preview */}
            {formData.role && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {roleOptions.find(r => r.value === formData.role)?.icon &&
                    React.createElement(roleOptions.find(r => r.value === formData.role).icon, { className: "h-6 w-6 text-blue-600" })}
                  <div>
                    <p className="font-medium">Logging in as: {roleOptions.find(r => r.value === formData.role)?.label}</p>
                    <p className="text-sm text-gray-600">
                      {formData.role === 'employee' && 'Access your grants, exercise shares, and view vesting schedule'}
                      {formData.role === 'hr' && 'Manage employees, review grant requests, and generate reports'}
                      {formData.role === 'admin' && 'Full system access, create grants, manage ESOP pool'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors disabled:opacity-60">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help? <button className="font-medium text-blue-600 hover:text-blue-500">Contact Support</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;