import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

export default function AdminLogin() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit() {
    if (login(username, password)) {
      navigate("/admin");
    } else {
      setError("Incorrect username or password.");
    }
  }

  return (
    <div className="container reveal" style={{ padding: "80px 24px", display: "grid", placeItems: "center" }}>
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
          padding: 36,
        }}
      >
        <p className="kicker" style={{ textAlign: "center" }}>
          Store Management
        </p>
        <h1 style={{ fontSize: "1.9rem", textAlign: "center", margin: "10px 0 4px" }}>
          Admin Login
        </h1>
        <hr className="hr-gold" style={{ margin: "16px auto 26px" }} />

        <div className="field">
          <label>Username</label>
          <input
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            autoFocus
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {error && (
          <p style={{ color: "var(--danger)", fontSize: "0.85rem", marginBottom: 14 }}>
            {error}
          </p>
        )}

        <button className="btn" style={{ width: "100%" }} onClick={submit}>
          Sign In
        </button>

        {/* <p style={{ color: "var(--text-dim)", fontSize: "0.78rem", marginTop: 18, textAlign: "center" }}>
          Demo login — <strong>admin</strong> / <strong>arabia2026</strong>.
          Change these in <code>src/store/useStore.jsx</code> before going live.
        </p> */}
      </div>
    </div>
  );
}
