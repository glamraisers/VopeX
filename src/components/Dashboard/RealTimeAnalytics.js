import React, { useEffect, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';

const RealTimeAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsService.getRealTimeAnalytics();
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="real-time-analytics">
      <h2>Real-Time Analytics</h2>
      {error && <p className="error">{error}</p>}
      {analytics && (
        <div>
          <h3>Current Statistics</h3>
          <p>Active Users: {analytics.activeUsers}</p>
          <p>New Leads: {analytics.newLeads}</p>
          <p>Conversions: {analytics.conversions}</p>
        </div>
      )}
    </div>
  );
};

export default RealTimeAnalytics;
