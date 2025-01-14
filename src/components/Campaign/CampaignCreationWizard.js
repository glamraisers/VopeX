import React, { useState } from 'react';
import { campaignService } from '../../services/campaignService';

const CampaignCreationWizard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await campaignService.createCampaign({ name, description, startDate, endDate });
      // Handle success (e.g., redirect to campaign dashboard)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="campaign-creation-wizard">
      <h2>Create Campaign</h2>
      <form onSubmit={handleCreateCampaign}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
};

export default CampaignCreationWizard;
