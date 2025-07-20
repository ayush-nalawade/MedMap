import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import api from '../../../utils/api';
import { useUser } from '../../../contexts/UserContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(location.state?.message || '');

  // Clear success message after 5 seconds
  React.useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.message === 'Unauthorized') {
        setErrors({
          general: "Invalid email or password. Please check your credentials and try again."
        });
      } else if (error.message.includes('Network')) {
        setErrors({
          general: "Network error. Please check your connection and try again."
        });
      } else {
        setErrors({
          general: "Login failed. Please try again."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} color="#059669" />
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          required
          disabled={isLoading}
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors duration-150"
            disabled={isLoading}
          >
            <Icon 
              name={showPassword ? "EyeOff" : "Eye"} 
              size={20} 
            />
          </button>
        </div>

        {/* General Error Message */}
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="AlertCircle" size={16} color="#DC2626" />
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/register-screen')}
              className="text-primary hover:text-primary/80 font-medium transition-colors duration-150"
              disabled={isLoading}
            >
              Create Account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;