import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../routes/AuthContext';

const SignUp = () => {
  const { signup, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    collegeCode: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.collegeCode.trim()) {
      newErrors.collegeCode = 'College code is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    clearError();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Create Account
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          College Event Management System
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="collegeCode"
              placeholder="College Code (e.g. MCET)"
              value={formData.collegeCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.collegeCode && (
              <p className="text-xs text-red-500 mt-1">
                {errors.collegeCode}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="College Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-pink-400 text-white font-medium hover:bg-pink-500 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/signin" className="text-pink-500 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
