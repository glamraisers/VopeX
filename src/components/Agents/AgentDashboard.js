import React, { useEffect, useState } from 'react';
import { agentService } from '../../services/agentService';

const AgentDashboard = () => {
  const [agentData, setAgentData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAgentData = async () => {
      try {
        const data = await agentService.getAgentData();
        setAgentData(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAgentData();
  }, []);

  return (
    <div className="agent-dashboard">
      <h2>Agent Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {agentData && (
        <div>
          <h3>Welcome, {agentData.name}</h3>
          <p>Assigned Leads: {agentData.assignedLeads}</p>
          <p>Converted Leads: {agentData.convertedLeads}</p>
          <p>Pending Tasks: {agentData.pendingTasks}</p>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
