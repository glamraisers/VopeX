import React, { useEffect, useState } from 'react';
import { leadService } from '../../services/leadService';

const LeadScoring = ({ leadId }) => {
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeadScore = async () => {
      try {
        const data = await leadService.getLeadScore(leadId);
        setScore(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeadScore();
  }, [leadId]);

  return (
    <div className="lead-scoring">
      <h2>Lead Scoring</h2>
      {error && <p className="error">{error}</p>}
      {score !== null && (
        <div>
          <h3>Lead Score: {score}</h3>
        </div>
      )}
    </div>
  );
};

export default LeadScoring;
