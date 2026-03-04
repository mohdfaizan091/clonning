import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

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
                    year: "numeric",
                    month: "long",
                    day: "numeric",
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
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Go to Login
            </button>
            <button className="btn-primary" onClick={() => navigate("/signup")}>
              Go to Signup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;