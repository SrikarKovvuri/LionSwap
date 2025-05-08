"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorNum, setErrorNum] = useState<number>(0);
  const [correctPasscode, setCorrectPasscode] = useState<string>("a");
  const [enteredPasscode, setEnteredPasscode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Create ref for the verification section
  const verificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // When errorNum changes to 201 (successful code sent), scroll to verification section
  useEffect(() => {
    if (errorNum === 201 && verificationRef.current) {
      // Scroll into view with smooth behavior
      verificationRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      
      // Focus on the passcode input field
      const passcodeInput = verificationRef.current.querySelector('input');
      if (passcodeInput) {
        passcodeInput.focus();
      }
      
      // Additional notification for mobile users
      if (window.innerWidth < 768) {
        // Visual indicator that appears briefly
        const indicator = document.createElement('div');
        indicator.style.position = 'fixed';
        indicator.style.bottom = '20px';
        indicator.style.left = '50%';
        indicator.style.transform = 'translateX(-50%)';
        indicator.style.padding = '12px 20px';
        indicator.style.backgroundColor = 'rgba(37, 99, 235, 0.9)';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '8px';
        indicator.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        indicator.style.zIndex = '50';
        indicator.style.fontWeight = 'bold';
        indicator.textContent = 'Verification code sent ↓';
        
        document.body.appendChild(indicator);
        
        setTimeout(() => {
          indicator.style.opacity = '0';
          indicator.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            document.body.removeChild(indicator);
          }, 500);
        }, 3000);
      }
    }
  }, [errorNum]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('https://lionswap.onrender.com/signup',
        {
          username,
          email,
          password,
          phone,
        }
      );
      if (response.status === 201) {
        alert("Signup successful. Please log in.");
        router.push("/login");
      }
    } catch (error: any) {
      alert(
        error.response?.data?.error ||
        "Error during signup. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const confirmCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      // Fixed endpoint URL - removed the extra slash
      const response = await axios.post('https://lionswap.onrender.com/confirm_credentials',
        {
          username,
          email,
          password,
          phone,
        }
      );
      if (response.status === 201) {
        setErrorNum(201);
        setCorrectPasscode(String(response.data.passcode));
      }
    } catch (error: any) {
      const status = error.response?.status;
      setErrorNum(status);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <main>
          <div className="bg-slate-100 rounded-lg shadow p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-gray-600">Sign up to get started</p>
            </div>

            <form onSubmit={confirmCredentials}>
              <div className="mb-4">
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium mb-2"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  required
                  minLength={6}
                  maxLength={16}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Choose a username (6-16 characters)"
                  disabled={isLoading || errorNum === 201}
                />
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email" // Fixed duplicate ID
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  minLength={5}
                  maxLength={35}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Columbia email (5-35 characters)"
                  disabled={isLoading || errorNum === 201}
                />
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                  required
                  minLength={5}
                  maxLength={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your phone number (5-12 characters)"
                  disabled={isLoading || errorNum === 201}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value)
                  }
                  required
                  minLength={6}
                  maxLength={16}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Create a password (6-16 characters)"
                  disabled={isLoading || errorNum === 201}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={isLoading || errorNum === 201}
              >
                {isLoading ? "Processing..." : "Sign Up"}
              </button>
            </form>

            {/* Error Messages */}
            {(errorNum===401) && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-500">
                  Email must be @columbia.edu or @barnard.edu
                </p>
              </div>
            )}

            {(errorNum===402) && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-500">
                  Username, Email, and Password are required.
                </p>
              </div>
            )}

            {(errorNum===403) && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-500">
                  Username is already taken.
                </p>
              </div>
            )}

            {(errorNum===404) && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-500">
                  Email is already taken.
                </p>
              </div>
            )}

            {(errorNum===405) && (
              <div className="mt-3 text-center">
                <p className="text-sm text-red-500">
                  Phone number is already taken.
                </p>
              </div>
            )}

            {/* Success Message */}
            {(errorNum===201) && (
              <div className="mt-3 text-center bg-green-50 p-3 rounded-lg border border-green-200">
                <p className="text-sm text-green-600 font-medium">
                  Verification code sent to your email!
                </p>
                <p className="text-xs text-green-600">
                  Please check your inbox and scroll down to verify
                </p>
              </div>
            )}

            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Already have an account? {" "}
                <Link href="/login">
                  <span className="text-blue-600 hover:underline font-medium">
                    Log in
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Verification Section with Ref */}
      {(errorNum===201) && (
        <div ref={verificationRef} className="container mx-auto px-4 py-8 max-w-lg">
          <main>
            <div className="bg-blue-50 rounded-lg shadow p-8 border-2 border-blue-200 animate-pulse-once">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2 text-blue-800">Verify Your Email</h1>
                <p className="text-gray-600">Check your inbox for a verification code sent to:</p>
                <p className="font-medium text-blue-700 mt-1">{email}</p>
              </div>

              <form onSubmit={(e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  if (enteredPasscode === correctPasscode) {
                    handleSubmit(e);
                  } else {
                    alert("Incorrect verification code. Please try again.");
                    setIsLoading(false);
                  }
                }}
              >
                <div className="mb-4">
                  <input
                    type="text"
                    id="passcode"
                    value={enteredPasscode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEnteredPasscode(e.target.value)
                    }
                    required
                    minLength={6}
                    maxLength={6}
                    className="w-full px-4 py-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
                    placeholder="Enter 6-digit code"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Complete Signup"}
                </button>
              </form>
            </div>
          </main>
        </div>
      )}
    </div>
  );
}