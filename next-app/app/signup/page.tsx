"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [ phone, setPhone ] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorNum, setErrorNum] = useState<number>(0);
  const [correctPasscode, setCorrectPasscode] = useState<string>("a");
  const [enteredPasscode, setEnteredPasscode] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        window.location.href = "/login";
      }
    } catch (error: any) {
      alert(
        error.response?.data?.error ||
        "Error during signup. Please try again."
      );
    }
  };

  const confirmCredentials = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
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
                  id="username"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  minLength={5}
                  maxLength={35}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your Columbia email (5-35 characters)"
                />
              </div>

              <div className="mb-4">
                <label 
                  htmlFor="email" 
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
                  placeholder="Create a password (6-10 characters)"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </form>

            {(errorNum===401) && (<div className="mt-3 text-center">
              <p className="text-sm text-red-500">
                Email must be @columbia.edu
              </p>
            </div>)}

            {(errorNum===402) && (<div className="mt-3 text-center">
              <p className="text-sm text-red-500">
                Username, Email, and Password are required.
              </p>
            </div>)}

            {(errorNum===403) && (<div className="mt-3 text-center">
              <p className="text-sm text-red-500">
                Username is already taken.
              </p>
            </div>)}

            {(errorNum===404) && (<div className="mt-3 text-center">
              <p className="text-sm text-red-500">
                Email is already taken.
              </p>
            </div>)}

            {(errorNum===405) && (<div className="mt-3 text-center">
              <p className="text-sm text-red-500">
                Phone number is already taken.
              </p>
            </div>)}

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

      {(errorNum===201) && (
        <div className="container mx-auto px-4 py-8 max-w-lg">
          <main>
            <div className="bg-slate-100 rounded-lg shadow p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">Confirm Your Email</h1>
                <p className="text-gray-600">Verification code sent to {email}</p>
                <p className="text-gray-600">Check your spam folder</p>
              </div>

              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (enteredPasscode === correctPasscode) {
                    handleSubmit(e);
                  } else {
                    alert("Incorrect verification code. Please try again.");
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter Code"
                  />
                </div>
                <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Confirm
              </button>
              </form>
            </div>
          </main>
        </div>
      )}

    </div>
  );
}