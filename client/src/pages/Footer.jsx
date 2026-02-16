import React from "react";

const Footer = () => {
  return (
    <footer >
      <div>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
        <span>&copy; {new Date().getFullYear()} My App. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
