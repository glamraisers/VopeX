import React, { useEffect, useState } from 'react';
import { leadService } from '../../services/leadService';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadService.getLeads();
        setLeads(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeads();
  }, []);

  return (
    <div className="lead-list">
      <h2>Lead List</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {leads.map((lead) => (
          <li key={lead.id}>
            <h3>{lead.name}</h3>
            <p>Email: {lead.email}</p>
            <p>Status: {lead.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeadList;
