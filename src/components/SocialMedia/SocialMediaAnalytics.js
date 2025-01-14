import React, { useEffect, useState } from 'react';
import { socialMediaService } from '../../services/socialMediaService';

const SocialMediaAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await socialMediaService.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="social-media-analytics">
      <h2>Social Media Analytics</h2>
      {error && <p className="error">{error}</p>}
      {analytics && (
        <div>
          <h3>Overview</h3>
          <p>Total Followers: {analytics.totalFollowers}</p>
          <p>Engagement Rate: {analytics.engagementRate}%</p>
          <p>Top Performing Post: {analytics.topPerformingPost}</p>
        </div>
      )}
    </div>
  );
};

export default SocialMediaAnalytics;
