import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../../services/authService';

const MultiFactorAuth = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleMFA = async (e) => {
    e.preventDefault();
    try {
      await authService.verifyMFA(code);
      history.push('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mfa-container">
      <h2>Multi-Factor Authentication</h2>
      <form onSubmit={handleMFA}>
        <div>
          <label>Enter Code:</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Verify</button>
      </form>
    </div>
  );
};

export default MultiFactorAuth;
