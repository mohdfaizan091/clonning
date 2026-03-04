import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="landing-page">
      <h1>Your App,<br />Your Rules.</h1>
      <p>
        A clean, secure, and modern web application.
        Built with React and Node.js — ready for anything.
      </p>
      <div className="cta">
        {user ? (
          <Link to="/me">
            <button className="btn-primary">Go to Dashboard</button>
          </Link>
        ) : (
          <>
            <Link to="/signup">
              <button className="btn-primary">Get Started</button>
            </Link>
            <Link to="/login">
              <button className="btn-secondary">Sign In</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default LandingPage;