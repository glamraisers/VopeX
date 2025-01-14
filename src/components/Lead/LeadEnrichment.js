import React, { useState } from 'react';
import { leadService } from '../../services/leadService';

const LeadEnrichment = ({ leadId }) => {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [error, setError] = useState('');

  const handleEnrichLead = async (e) => {
    e.preventDefault();
    try {
      await leadService.enrichLead(leadId, additionalInfo);
      // Handle success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="lead-enrichment">
      <h2>Lead Enrichment</h2>
      <form onSubmit={handleEnrichLead}>
        <div>
          <label>Additional Information:</label>
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Enrich Lead</button>
      </form>
    </div>
  );
};

export default LeadEnrichment;
