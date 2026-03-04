import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="form-card">
          <p className="form-title">Check your email</p>
          <p className="form-sub">
            If this email exists, a reset link has been sent. Check your inbox.
          </p>
          <div className="alert alert-success" style={{ marginTop: "8px" }}>
            ✓ Reset link sent successfully
          </div>
          <Link to="/login">
            <button className="btn-secondary" style={{ width: "100%", marginTop: "8px" }}>
              Back to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <p className="form-title">Forgot Password</p>
          <p className="form-sub">Enter your email — we'll send a reset link</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="form-footer">
          Remember your password?{" "}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;