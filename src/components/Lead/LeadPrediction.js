import React, { useEffect, useState } from 'react';
import { leadService } from '../../services/leadService';

const LeadPrediction = ({ leadId }) => {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeadPrediction = async () => {
      try {
        const data = await leadService.getLeadPrediction(leadId);
        setPrediction(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLeadPrediction();
  }, [leadId]);

  return (
    <div className="lead-prediction">
      <h2>Lead Prediction</h2>
      {error && <p className="error">{error}</p>}
      {prediction && (
        <div>
          <h3>Prediction: {prediction.outcome}</h3>
          <p>Confidence: {prediction.confidence}%</p>
        </div>
      )}
    </div>
  );
};

export default LeadPrediction;
