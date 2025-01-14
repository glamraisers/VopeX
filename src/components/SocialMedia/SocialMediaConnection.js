import React, { useState } from 'react';
import { socialMediaService } from '../../services/socialMediaService';

const SocialMediaConnection = () => {
  const [platform, setPlatform] = useState('');
  const [credentials, setCredentials] = useState('');
  const [error, setError] = useState('');

  const handleConnect = async (e) => {
    e.preventDefault();
    try {
      await socialMediaService.connectPlatform(platform, credentials);
      // Handle success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="social-media-connection">
      <h2>Connect Social Media</h2>
      <form onSubmit={handleConnect}>
        <div>
          <label>Platform:</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="">Select Platform</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div>
          <label>Credentials:</label>
          <input
            type="text"
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Connect</button>
      </form>
    </div>
  );
};

export default SocialMediaConnection;
