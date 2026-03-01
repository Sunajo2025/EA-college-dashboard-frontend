/**
 * Sign In Page
 * User authentication page
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../routes/AuthContext";

const SignIn = () => {
  const { signin, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    tenantId: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.tenantId.trim()) {
      newErrors.tenantId = "Shop/Tenant ID is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
    clearError();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signin({
        tenantId: formData.tenantId.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSuccess("Signin successful! Redirecting...");
    } catch (err) {
      console.error("Signin error:", err);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
          alt="signin-bg"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-16 lg:px-24">
        <h2 className="text-2xl font-bold mb-6">
          Sign in to your account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Tenant ID */}
          <div>
            <input
              type="text"
              name="tenantId"
              placeholder="Shop/Tenant ID"
              value={formData.tenantId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.tenantId && (
              <p className="text-red-600 text-sm mt-1">
                {errors.tenantId}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Enter your shop or tenant identifier
            </p>
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {success && (
            <p className="text-green-600 text-sm">{success}</p>
          )}
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
