"use client";

import { useState } from "react";
import { useEffect } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameErrorText, setUsernameError] = useState("");
  const [passwordErrorText, setPasswordError] = useState("");
  let usernameErrorBool = false;
  let passwordErrorBool = false;
  useEffect(() => {
    window.history.replaceState({}, "", "/register");
  });
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (username.trim().length < 4) {
      setUsernameError("Username must be at least 4 characters long.");
      usernameErrorBool = true;
    }
    if (password.trim().length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      passwordErrorBool = true;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setPasswordError("Passwords do not match.");
      passwordErrorBool = true;
    }
    if (!passwordErrorBool && !usernameErrorBool) {
      console.log("Registering user:", { username, password });
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        document.location.href = "/home?userId=" + data.uuid;
      } else {
        alert(
          "Error registering user: " + (await response.json()).error ||
            "Unknown error",
        );
      }
    }
  }
  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username">Username:</label>
          {usernameErrorText && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {usernameErrorText}
            </p>
          )}
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (usernameErrorText) setUsernameError("");
              usernameErrorBool = false;
            }}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password:</label>
          {passwordErrorText && (
            <p style={{ color: "red", marginTop: "5px" }}>
              {passwordErrorText}
            </p>
          )}
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordErrorText) setPasswordError("");
              passwordErrorBool = false;
            }}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (passwordErrorText) setPasswordError("");
              passwordErrorBool = false;
            }}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", cursor: "pointer" }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
