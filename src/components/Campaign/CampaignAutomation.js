import React, { useState } from 'react';
import { campaignService } from '../../services/campaignService';

const CampaignAutomation = ({ campaignId }) => {
  const [automationRules, setAutomationRules] = useState([]);
  const [error, setError] = useState('');

  const handleAddRule = (rule) => {
    setAutomationRules([...automationRules, rule]);
  };

  const handleSaveRules = async () => {
    try {
      await campaignService.saveAutomationRules(campaignId, automationRules);
      // Handle success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="campaign-automation">
      <h2>Campaign Automation</h2>
      {error && <p className="error">{error}</p>}
      <div>
        <h3>Add Automation Rule</h3>
        <button onClick={() => handleAddRule({ type: 'email', condition: 'new_lead', action: 'send_welcome_email' })}>
          Add Email Rule
        </button>
        <button onClick={() => handleAddRule({ type: 'sms', condition: 'lead_converted', action: 'send_thank_you_sms' })}>
          Add SMS Rule
        </button>
      </div>
      <div>
        <h3>Saved Rules</h3>
        <ul>
          {automationRules.map((rule, index) => (
            <li key={index}>
              {rule.type} - {rule.condition} - {rule.action}
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSaveRules}>Save Rules</button>
    </div>
  );
};

export default CampaignAutomation;
