import React, { useState } from 'react';
import { socialMediaService } from '../../services/socialMediaService';

const SocialMediaSettings = () => {
  const [settings, setSettings] = useState({
    autoPost: false,
    postFrequency: 'daily',
  });
  const [error, setError] = useState('');

  const handleSaveSettings = async () => {
    try {
      await socialMediaService.saveSettings(settings);
      // Handle success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="social-media-settings">
      <h2>Social Media Settings</h2>
      <div>
        <label>
          Enable Auto Post:
          <input
            type="checkbox"
            checked={settings.autoPost}
            onChange={(e) => setSettings({ ...settings, autoPost: e.target.checked })}
          />
        </label>
      </div>
      <div>
        <label>Post Frequency:</label>
        <select
          value={settings.postFrequency}
          onChange={(e) => setSettings({ ...settings, postFrequency: e.target.value })}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default SocialMediaSettings;
