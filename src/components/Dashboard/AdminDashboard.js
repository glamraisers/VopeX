import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="admin-metrics">
        <h3>Key Metrics</h3>
        <p>Total Users: 1000</p>
        <p>Active Campaigns: 50</p>
        <p>Total Leads: 5000</p>
      </div>
      <div className="admin-reports">
        <h3>Reports</h3>
        <p>Sales Report</p>
        <p>Marketing Report</p>
        <p>User Engagement Report</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
