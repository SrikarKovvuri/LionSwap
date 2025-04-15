"use client";
import React, { useState } from "react";
import axios from "axios";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
 


  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`,
        {
          username,
          password,
        }
      );

      // If the signup is successful (status 201 created)
      if (response.status === 201) {
       
        alert("Signup successful. Please log in.");
        window.location.href = "/login"; 
      }
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Error during signup. Please try again."
      );
    }
  };

  return (
    <div className="signup-container" style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "4px" }}>
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "4px" }}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
