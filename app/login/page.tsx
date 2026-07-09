"use client";

import { useState, useEffect } from "react";
import { login } from "../authContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    window.history.replaceState({}, "", "/login");
  });
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const user = await login(username, password);
    if (user !== null) {
      document.location.href = "/home?userId=" + user.uuid;
    } else {
      setError("Username or password are incorrect");
    }
  }
  return (
    <div style={{ maxWidth: "360px", margin: "0 auto", padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <p
            style={{
              color: "red",
              marginBottom: "0.5rem",
            }}
          >
            {error}
          </p>
          <label
            htmlFor="text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Username
          </label>
          <input
            type="text"
            id="text"
            name="username"
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="MyUsername"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            placeholder="Enter your password"
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button type="submit" style={{ padding: "0.75rem 1rem" }}>
          Sign In
        </button>
      </form>
    </div>
  );
}
