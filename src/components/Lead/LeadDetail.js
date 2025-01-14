import React, { useEffect, useState } from 'react';
import { leadService } from '../../services/leadService';

const LeadDetail = ({ leadId }) => {
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await leadService.getLead(leadId);
        setLead(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLead();
  }, [leadId]);

  return (
    <div className="lead-detail">
      <h2>Lead Detail</h2>
      {error && <p className="error">{error}</p>}
      {lead && (
        <div>
          <h3>{lead.name}</h3>
          <p>Email: {lead.email}</p>
          <p>Phone: {lead.phone}</p>
          <p>Status: {lead.status}</p>
          <p>Notes: {lead.notes}</p>
        </div>
      )}
    </div>
  );
};

export default LeadDetail;
