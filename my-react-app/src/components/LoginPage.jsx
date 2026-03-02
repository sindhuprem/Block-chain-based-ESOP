import React, { useState } from 'react';
import { Eye, EyeOff, Building2, Shield, Users, User } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Role options with icons
  const roleOptions = [
    { value: '', label: 'Select your role', icon: null },
    { value: 'employee', label: 'Employee', icon: User },
    { value: 'hr-manager', label: 'HR Manager', icon: Users },
    { value: 'admin', label: 'Admin', icon: Shield }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - Replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login attempt:', formData);
      
      // Redirect based on role
      switch (formData.role) {
        case 'employee':
        console.log('Redirecting to Employee Dashboard');
        navigate("/employee-dashboard");   // ✅ ADD THIS
        break;

        case 'hr-manager':
  navigate("/hr-dashboard");
  break;

  case 'admin':
    navigate("/admin-dashboard");
    break;
  
        default:
          console.error('Unknown role');
      }
      
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ submit: 'Login failed. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your ESOP Management Account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="off"
                value={formData.email}
                onChange={handleInputChange}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`select-field ${errors.role ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Role Preview Cards */}
            {formData.role && (
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center space-x-3">
                  {roleOptions.find(r => r.value === formData.role)?.icon && (
                    React.createElement(roleOptions.find(r => r.value === formData.role).icon, {
                      className: "h-6 w-6 text-primary-600"
                    })
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      Logging in as: {roleOptions.find(r => r.value === formData.role)?.label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formData.role === 'employee' && 'Access your grants, exercise shares, and view vesting schedule'}
                      {formData.role === 'hr-manager' && 'Manage employees, review grant requests, and generate reports'}
                      {formData.role === 'admin' && 'Full system access, create grants, manage ESOP pool'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need help?{' '}
              <button className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                Contact Support
              </button>
            </p>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default LoginPage;
