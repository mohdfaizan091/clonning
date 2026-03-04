import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../api/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    if (password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    setLoading(true);

    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <p className="form-title">Reset Password</p>
          <p className="form-sub">Enter your new password below</p>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <p className="form-sub" style={{ marginBottom: 0 }}>
          Min 8 chars, uppercase, lowercase & number required
        </p>

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>

        <p className="form-footer">
          <Link to="/login" className="link">Back to Login</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;