import React from "react";

const Privacy = () => (
  <div className="text-page">
    <h1>Privacy Policy</h1>
    <p className="meta">Last updated: {new Date().getFullYear()}</p>

    <h2>Information We Collect</h2>
    <p>
      We collect only the information you provide directly to us — your username,
      email address, and password. Your password is hashed and never stored in
      plain text.
    </p>

    <h2>How We Use It</h2>
    <p>
      Your information is used solely to authenticate you and provide access to
      the app. We do not sell, trade, or share your data with third parties.
    </p>

    <h2>Cookies</h2>
    <p>
      We use an httpOnly cookie to keep you logged in securely. This cookie
      cannot be accessed by JavaScript and expires after 1 hour.
    </p>

    <h2>Contact</h2>
    <p>
      If you have any questions about this policy, reach out to us at
      support@myapp.com.
    </p>
  </div>
);

export default Privacy;