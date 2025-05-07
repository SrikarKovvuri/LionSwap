"use client"
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsLoggedIn, refetchUser } = useAuth(); // Import refetchUser from context
  const router = useRouter();

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginFailed(false);
    
    const data = {
      username,
      password,
    };

    try {
      const response = await axios.post("https://lionswap.onrender.com/login", data);
      if (response.status === 201) {
        const { token } = response.data;
        
        // Store token
        localStorage.setItem("token", token);
        
        // Set logged in state first
        setIsLoggedIn(true);
        
        // Fetch user data using the refetchUser function from context
        await refetchUser();
        
        // Only navigate after state is updated
        router.push("/");
        router.refresh();
      } else {
        setLoginFailed(true);
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      setLoginFailed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <main>
        <div className="bg-slate-100 rounded-lg shadow p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Please log in to continue</p>
          </div>

          <form onSubmit={handleData}>
            <div className="mb-4">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={username}
                onChange={handleUsername}
                required
                minLength={6}
                maxLength={16}
                placeholder="Enter your username"
                disabled={isLoading}
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
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={handlePassword}
                required
                minLength={6}
                maxLength={16}
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          {loginFailed && (
            <div className="mt-6 text-center">
              <p className="text-sm text-red-600">
                Login failed, please check your credentials and try again
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? {" "}
              <Link href="/signup">
                <span className="text-blue-600 hover:underline font-medium">
                  Sign up
                </span>
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}