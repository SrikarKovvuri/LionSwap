"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorNum, setErrorNum] = useState<number>(0);
  const [correctPasscode, setCorrectPasscode] = useState<string>("a");
  const [enteredPasscode, setEnteredPasscode] = useState<string>("z");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup',
        {
          username,
          email,
          password,
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
      const response = await axios.post('http://localhost:5000/confirm_credentials',
        {
          username,
          email,
          password,
        }
      );
      if (response.status === 201) {
        setErrorNum(201);
        setCorrectPasscode(String(response.data.passcode));
      }

      // use Python to generate random 6-digit number for password
      // confirm_credentials backend function must return the passcode to frontend in JSON
      // frontend will store it in a state for "correct passcode"

      // confirm_credentials backend function must use Gmail API to send the verification code

    } catch (error: any) {
      const status = error.response?.status;
      setErrorNum(status);
    }
  };

  return (
    <div className="space-y-5">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <main>
          <div className="bg-white rounded-lg shadow p-8">
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
                  placeholder="Enter your email (5-35 characters)"
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


            {(errorNum===402) && (<div className="mt-6 text-center">
              <p className="text-sm text-red-500">
                Username, Email, and Password are required
              </p>
            </div>)}

            {(errorNum===403) && (<div className="mt-6 text-center">
              <p className="text-sm text-red-500">
                Username is already taken
              </p>
            </div>)}

            <div className="mt-6 text-center">
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
            <div className="bg-white rounded-lg shadow p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold mb-2">Confirm Your Email</h1>
                <p className="text-gray-600">verification code sent to {email}</p>
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
                    value={username}
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
              </form>
            </div>
          </main>
        </div>
      )}

    </div>
  );
}