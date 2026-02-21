import React from "react";

const Terms = () => (
  <div className="text-page">
    <h1>Terms of Service</h1>
    <p className="meta">Last updated: {new Date().getFullYear()}</p>

    <h2>Acceptance</h2>
    <p>
      By creating an account and using this app, you agree to these terms.
      If you do not agree, please do not use the service.
    </p>

    <h2>Your Account</h2>
    <p>
      You are responsible for keeping your credentials secure. Do not share
      your password with anyone. We are not liable for any loss caused by
      unauthorized access to your account.
    </p>

    <h2>Acceptable Use</h2>
    <p>
      You agree to use this app only for lawful purposes. You must not attempt
      to reverse engineer, abuse, or disrupt the service in any way.
    </p>

    <h2>Termination</h2>
    <p>
      We reserve the right to suspend or terminate your account if you violate
      these terms.
    </p>

    <h2>Contact</h2>
    <p>
      For any questions regarding these terms, contact us at
      support@myapp.com.
    </p>
  </div>
);

export default Terms;