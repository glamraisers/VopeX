import React, { useEffect, useState } from 'react';
import { campaignService } from '../../services/campaignService';

const CampaignAnalytics = ({ campaignId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await campaignService.getCampaignAnalytics(campaignId);
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnalytics();
  }, [campaignId]);

  return (
    <div className="campaign-analytics">
      <h2>Campaign Analytics</h2>
      {error && <p className="error">{error}</p>}
      {analytics && (
        <div>
          <h3>{analytics.name}</h3>
          <p>Impressions: {analytics.impressions}</p>
          <p>Clicks: {analytics.clicks}</p>
          <p>Click-Through Rate: {analytics.clickThroughRate}%</p>
        </div>
      )}
    </div>
  );
};

export default CampaignAnalytics;
