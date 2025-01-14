import React, { useState } from 'react';
import { authService } from '../../services/authService';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await authService.resetPassword(email);
      setMessage('Password reset link sent to your email');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Password Reset</h2>
      <form onSubmit={handlePasswordReset}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordReset;
