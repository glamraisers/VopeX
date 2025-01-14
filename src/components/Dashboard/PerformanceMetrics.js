import React from 'react';

const PerformanceMetrics = () => {
  return (
    <div className="performance-metrics">
      <h2>Performance Metrics</h2>
      <div className="metrics-overview">
        <h3>Overview</h3>
        <p>Conversion Rate: 10%</p>
        <p>Average Deal Size: $5000</p>
        <p>Sales Cycle Length: 30 days</p>
      </div>
      <div className="metrics-details">
        <h3>Detailed Metrics</h3>
        <p>Lead Source Effectiveness</p>
        <p>Campaign ROI</p>
        <p>Agent Performance</p>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
