import React, { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/layout/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ForgotPasswordModal } from "../components/modals/ForgotPasswordModal";

interface LoginPageProps {
  onLogin?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (formData.password === "fail") {
        setErrors({ form: "Invalid email or password" });
      } else {
        // Successful login
        if (onLogin) {
          onLogin();
        } else {
          // Fallback if no callback
          navigate("/dashboard");
        }
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        <>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="font-semibold text-[#4F46E5] dark:text-indigo-400 hover:text-[#4338CA] dark:hover:text-indigo-300 hover:underline transition-colors"
          >
            Sign up
          </button>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-200 border border-red-100 dark:border-red-900/30">
            {errors.form}
          </div>
        )}

        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />

        <div className="space-y-1">
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsForgotPasswordOpen(true)}
              className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#4F46E5] dark:hover:text-indigo-400 transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </div>
      </form>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </AuthLayout>
  );
};
