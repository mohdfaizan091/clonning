import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="landing-page">
      <h1 style={{ fontSize: "6rem", color: "var(--border-2)", lineHeight: 1 }}>
        404
      </h1>
      <p>This page does not exist.</p>
      <div className="cta">
        <Link to="/">
          <button className="btn-primary" style={{ width: "auto", padding: "10px 20px" }}>
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;