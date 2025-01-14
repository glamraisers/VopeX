import React, { useEffect, useState } from 'react';
import { campaignService } from '../../services/campaignService';

const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="campaign-dashboard">
      <h2>Campaign Dashboard</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            <h3>{campaign.name}</h3>
            <p>{campaign.description}</p>
            <p>Start Date: {campaign.startDate}</p>
            <p>End Date: {campaign.endDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignDashboard;
