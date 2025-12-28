import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for the 5 digit inputs to manage focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEmail("");
      setCode(["", "", "", "", ""]);
      setIsLoading(false);
      // Reset refs array
      inputRefs.current = [];
    }
  }, [isOpen]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return; // Basic validation

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Check if all digits are filled
    if (code.some((d) => !d)) return;

    setIsLoading(true);
    // Simulate verification API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would likely redirect to a "Change Password" screen or log them in
      alert(
        "Code verified successfully. You would now be prompted to set a new password."
      );
      onClose();
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1); // Keep only the last character entered
    setCode(newCode);

    // Auto-focus next input if value is entered
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on Backspace if current is empty
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 5).split("");
    if (pastedData.every((char) => /^\d$/.test(char))) {
      const newCode = [...code];
      pastedData.forEach((char, index) => {
        if (index < 5) newCode[index] = char;
      });
      setCode(newCode);
      // Focus the last filled input or the first empty one
      const focusIndex = Math.min(pastedData.length, 4);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={step === 1 ? "Reset Password" : "Verify Code"}
      maxWidth="max-w-md"
    >
      {step === 1 ? (
        <form onSubmit={handleSendCode} className="space-y-6">
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Enter the email address associated with your account and we'll send
            you a verification code to reset your password.
          </p>

          <Input
            id="reset-email"
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isLoading}>
              Send Code
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-8">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
              We sent a 5-digit code to{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {email}
              </span>
              . Enter it below to verify your identity.
            </p>

            <div
              className="flex justify-center gap-2 sm:gap-3"
              onPaste={handlePaste}
            >
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`
                    w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-lg border shadow-sm outline-none transition-all duration-200
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    ${
                      digit
                        ? "border-[#4F46E5] ring-1 ring-[#4F46E5]"
                        : "border-gray-200 dark:border-gray-700 focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5] focus:ring-offset-0"
                    }
                  `}
                />
              ))}
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Didn't receive code?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
                className="text-[#4F46E5] dark:text-indigo-400 hover:underline font-medium"
              >
                Resend
              </button>
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              Change email
            </button>
            <Button
              type="submit"
              isLoading={isLoading}
              className="!w-auto px-6"
            >
              Verify & Reset
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
