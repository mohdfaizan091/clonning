import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", form);
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      navigate("/me");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <p className="form-title">Welcome back</p>
          <p className="form-sub">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠ {error}
          </div>
        )}

        <input
          placeholder="Email"
          type="email"
          className={error ? "error" : ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className={error ? "error" : ""}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="form-footer">
          <Link to="/forgot-password" className="link">Forgot password?</Link>
        </p>

        <p className="form-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="link">Sign up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;