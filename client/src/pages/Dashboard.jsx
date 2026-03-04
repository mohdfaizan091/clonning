import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/api";

const StatCard = ({ label, value, color }) => (
  <div className="dashboard-card" style={{ flex: 1, minWidth: "120px", textAlign: "center", padding: "20px 16px" }}>
    <p style={{ fontSize: "1.8rem", fontWeight: 700, fontFamily: "var(--display)", color: color || "var(--text)" }}>
      {value}
    </p>
    <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" }}>
      {label}
    </p>
  </div>
);

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/stats")
      .then(res => setStats(res.data.stats))
      .catch(() => setStats(null))
      .finally(() => setStatsLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {user ? (
        <>
          {/* Stats Section */}
          <div>
            <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>
              Overview
            </p>
            {statsLoading ? (
              <div style={{ display: "flex", gap: "10px" }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="dashboard-card" style={{ flex: 1, height: "80px", opacity: 0.4 }} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <StatCard label="Total"     value={stats?.total     || 0} color="var(--text)"  />
                <StatCard label="Applied"   value={stats?.Applied   || 0} color="var(--blue)"  />
                <StatCard label="Interview" value={stats?.Interview || 0} color="var(--orange)"/>
                <StatCard label="Offer"     value={stats?.Offer     || 0} color="var(--green)" />
                <StatCard label="Rejected"  value={stats?.Rejected  || 0} color="var(--red)"   />
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <h2>Quick Actions</h2>
            <div className="dashboard-actions">
              <Link to="/applications/new">
                <button className="btn-primary" style={{ width: "auto", padding: "10px 20px" }}>
                  + New Application
                </button>
              </Link>
              <Link to="/applications">
                <button className="btn-secondary">
                  View All Applications
                </button>
              </Link>
            </div>
          </div>

          {/* Profile */}
          <div className="dashboard-card">
            <h2>Your Profile</h2>
            <div className="user-info">
              <div className="user-info-row">
                <span className="user-info-label">Username</span>
                <span className="user-info-value">{user.username}</span>
              </div>
              <div className="user-info-row">
                <span className="user-info-label">Email</span>
                <span className="user-info-value">{user.email}</span>
              </div>
              <div className="user-info-row">
                <span className="user-info-label">Status</span>
                <span className="status-badge status-online">Online</span>
              </div>
              <div className="user-info-row">
                <span className="user-info-label">Joined</span>
                <span className="user-info-value">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <button className="btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <div className="dashboard-card">
          <h2>Not logged in</h2>
          <div className="dashboard-actions">
            <button className="btn-secondary" onClick={() => navigate("/login")}>Go to Login</button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>Go to Signup</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;