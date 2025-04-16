"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      username,
      password,
    };

    try {
      const response = await axios.post("http://localhost:5000/login", data);
      if (response.status === 201) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        alert("Login Successful");
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.error || "Error during login. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Please log in to continue</p>
        </div>

        <form onSubmit={handleData}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={handleUsername}
              required
              minLength={6}
              maxLength={10}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={handlePassword}
              required
              minLength={6}
              maxLength={10}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
