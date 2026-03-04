import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit}>
        <div>
          <p className="form-title">Create account</p>
          <p className="form-sub">Join us today</p>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠ {error}
          </div>
        )}

        <input
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <p className="form-sub" style={{ marginBottom: 0 }}>
          Min 8 chars, uppercase, lowercase & number required
        </p>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="form-footer">
          Already have an account?{" "}
          <Link to="/login" className="link">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;