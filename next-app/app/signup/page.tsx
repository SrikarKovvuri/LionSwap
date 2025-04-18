"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function SignUp() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup',
        {
          username,
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <main>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600">Sign up to get started</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Choose a username (6-10 characters)"
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
                maxLength={10}
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
  );
}