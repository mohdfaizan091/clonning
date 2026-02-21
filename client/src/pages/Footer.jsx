import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <Link to="/privacy" className="link">Privacy Policy</Link>
        <span style={{ color: "var(--border-2)", margin: "0 8px" }}>·</span>
        <Link to="/terms" className="link">Terms of Service</Link>
        <span style={{ margin: "0 16px", color: "var(--border-2)" }}>|</span>
        <span>&copy; {new Date().getFullYear()} My App. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;