import React, { useState } from "react";
import { createUser } from "../utils/api";
import { setStoredUser, getStoredUser, type StoredUser } from "../utils/userStorage";

interface UserLoginProps {
  onUserSet: (user: StoredUser) => void;
}

export default function UserLogin({ onUserSet }: UserLoginProps): React.JSX.Element {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing user
  React.useEffect(() => {
    const existingUser = getStoredUser();
    if (existingUser) {
      onUserSet(existingUser);
    }
  }, [onUserSet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await createUser(username, email);
      setStoredUser(user);
      onUserSet(user);
      setUsername("");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const existingUser = getStoredUser();
  if (existingUser) {
    return (
      <div
        style={{
          padding: "10px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "4px",
          margin: "10px",
        }}
      >
        <div style={{ fontSize: "14px" }}>
          Logged in as: <strong>{existingUser.username}</strong>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "15px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        margin: "10px",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "10px" }}>Login / Create Account</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            Username:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
        {error && (
          <div style={{ color: "red", fontSize: "12px", marginBottom: "10px" }}>
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          {loading ? "Creating..." : "Create Account / Login"}
        </button>
      </form>
    </div>
  );
}

