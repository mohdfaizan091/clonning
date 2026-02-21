import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../App.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");   // backend clears the cookie
    setUser(null);
    navigate('/login');
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
          <h2>Welcome {user.username}!</h2>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <h2>Not logged in</h2>
          <div className="dashboard-actions">
            <button onClick={() => navigate('/login')}>Go to Login</button>
            <button onClick={() => navigate('/signup')}>Go to Signup</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;