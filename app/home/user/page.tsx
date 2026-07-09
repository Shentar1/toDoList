"use client";

import { useEffect, useState } from "react";
import { getSession } from "../../authContext";

export default function User() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  getSession().then((session) => {
    setUsername(session.username);
  });
  useEffect(() => {
    window.history.replaceState({}, "", "/user");
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // TODO: send updated user details to API
    console.log({ username, password });
  };

  return (
    <div>
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}
