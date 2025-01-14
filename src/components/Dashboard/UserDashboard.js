import React from 'react';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>
      <div className="user-metrics">
        <h3>Your Metrics</h3>
        <p>Assigned Leads: 100</p>
        <p>Converted Leads: 50</p>
        <p>Pending Tasks: 10</p>
      </div>
      <div className="user-notifications">
        <h3>Notifications</h3>
        <p>New lead assigned</p>
        <p>Campaign update</p>
        <p>Task reminder</p>
      </div>
    </div>
  );
};

export default UserDashboard;
