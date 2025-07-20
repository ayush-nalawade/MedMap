import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import api from '../../../utils/api';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError
  } = useForm();

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthLevels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Very Weak', color: 'bg-red-500' },
      { strength: 2, label: 'Weak', color: 'bg-orange-500' },
      { strength: 3, label: 'Fair', color: 'bg-yellow-500' },
      { strength: 4, label: 'Good', color: 'bg-blue-500' },
      { strength: 5, label: 'Strong', color: 'bg-green-500' }
    ];

    return strengthLevels[score];
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare registration data
      const registrationData = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        organization: data.organization,
        role: 'admin' // Default role
      };

      const response = await api.register(registrationData);
      
      console.log('Registration successful:', response);
      navigate('/login-screen', { 
        state: { 
          message: 'Account created successfully! Please sign in to continue.',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Registration failed:', error);
      
      if (error.message.includes('email already exists')) {
        setError('email', {
          type: 'manual',
          message: 'Email already exists. Please use a different email or try logging in.'
        });
      } else if (error.message.includes('Network')) {
        setError('root', {
          type: 'manual',
          message: 'Network error. Please check your connection and try again.'
        });
      } else {
        setError('root', {
          type: 'manual',
          message: 'Registration failed. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <Input
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        error={errors.fullName?.message}
        required
        disabled={isLoading}
        {...register('fullName', {
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters'
          }
        })}
      />

      {/* Email */}
      <Input
        label="Email Address"
        type="email"
        placeholder="Enter your email address"
        error={errors.email?.message}
        required
        disabled={isLoading}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address'
          }
        })}
      />

      {/* Password */}
      <div className="relative">
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Create a strong password"
          error={errors.password?.message}
          required
          disabled={isLoading}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters'
            }
          })}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
        
        {/* Password Strength Indicator */}
        {password && (
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary">
                {passwordStrength.label}
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              Use 8+ characters with uppercase, lowercase, numbers & symbols
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          required
          disabled={isLoading}
          {...register('confirmPassword', {
            required: 'Please confirm your password'
          })}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-9 text-text-secondary hover:text-text-primary transition-colors"
          disabled={isLoading}
        >
          <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
        
        {/* Password Match Indicator */}
        {confirmPassword && (
          <div className="mt-1 flex items-center gap-2">
            <Icon 
              name={password === confirmPassword ? 'Check' : 'X'} 
              size={16} 
              color={password === confirmPassword ? 'green' : 'red'}
            />
            <span className={`text-xs ${
              password === confirmPassword ? 'text-green-600' : 'text-red-600'
            }`}>
              {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
            </span>
          </div>
        )}
      </div>

      {/* Organization Name */}
      <Input
        label="Organization Name"
        type="text"
        placeholder="Enter your healthcare organization"
        error={errors.organization?.message}
        required
        disabled={isLoading}
        {...register('organization', {
          required: 'Organization name is required'
        })}
      />

      {/* Root Error Message */}
      {errors.root && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={16} color="#DC2626" />
            <p className="text-sm text-red-600">{errors.root.message}</p>
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
        iconName="UserPlus"
        iconPosition="left"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};

export default RegistrationForm;