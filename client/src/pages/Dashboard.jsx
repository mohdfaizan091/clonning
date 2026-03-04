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
          <h1>YOUR DASHBOARD</h1>
          <h2>Welcome {user.username}!</h2>
          <p>Email: {user.email}</p>
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