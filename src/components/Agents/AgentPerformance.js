import React, { useEffect, useState } from 'react';
import { agentService } from '../../services/agentService';

const AgentPerformance = ({ agentId }) => {
  const [performance, setPerformance] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const data = await agentService.getAgentPerformance(agentId);
        setPerformance(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPerformance();
  }, [agentId]);

  return (
    <div className="agent-performance">
      <h2>Agent Performance</h2>
      {error && <p className="error">{error}</p>}
      {performance && (
        <div>
          <h3>{performance.name}</h3>
          <p>Leads Converted: {performance.leadsConverted}</p>
          <p>Average Response Time: {performance.averageResponseTime} minutes</p>
          <p>Customer Satisfaction: {performance.customerSatisfaction}%</p>
        </div>
      )}
    </div>
  );
};

export default AgentPerformance;
