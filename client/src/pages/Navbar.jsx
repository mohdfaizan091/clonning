import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">myapp</Link>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li><Link to="/me">Dashboard</Link></li>
            <li>
              <button className="btn-danger" onClick={handleLogout}
                style={{ padding: "6px 14px", fontSize: "0.78rem" }}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;