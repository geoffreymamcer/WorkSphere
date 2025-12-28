import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface SignupPageProps {
  onLogin?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      // Logic would typically go here to create account
      // For demo, we just log them in
      if (onLogin) {
        onLogin();
      } else {
        navigate("/dashboard");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle={
        <>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-[#4F46E5] dark:text-indigo-400 hover:text-[#4338CA] dark:hover:text-indigo-300 hover:underline transition-colors"
          >
            Sign in
          </button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <Input
          id="name"
          name="name"
          type="text"
          label="Full Name"
          placeholder="Jane Doe"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
        />

        <Input
          id="email"
          name="email"
          type="email"
          label="Work Email"
          placeholder="you@company.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading}>
            Create account
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          By creating an account, you agree to our{" "}
          <a
            href="#"
            className="text-[#4F46E5] dark:text-indigo-400 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-[#4F46E5] dark:text-indigo-400 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  );
};
