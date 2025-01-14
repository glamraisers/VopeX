import React, { useState } from 'react';
import { agentService } from '../../services/agentService';

const AgentSettings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
  });
  const [error, setError] = useState('');

  const handleSaveSettings = async () => {
    try {
      await agentService.saveSettings(settings);
      // Handle success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="agent-settings">
      <h2>Agent Settings</h2>
      <div>
        <label>
          Enable Notifications:
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
          />
        </label>
      </div>
      <div>
        <label>
          Enable Email Alerts:
          <input
            type="checkbox"
            checked={settings.emailAlerts}
            onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
          />
        </label>
      </div>
      <div>
        <label>
          Enable SMS Alerts:
          <input
            type="checkbox"
            checked={settings.smsAlerts}
            onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
          />
        </label>
      </div>
      {error && <p className="error">{error}</p>}
      <button onClick={handleSaveSettings}>Save Settings</button>
    </div>
  );
};

export default AgentSettings;
