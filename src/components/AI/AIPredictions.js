import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/aiService';

const AIPredictions = () => {
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const data = await aiService.getPredictions();
        setPredictions(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPredictions();
  }, []);

  return (
    <div className="ai-predictions">
      <h2>AI Predictions</h2>
      {error && <p className="error">{error}</p>}
      {predictions && (
        <div>
          <h3>Sales Forecast</h3>
          <p>Next Quarter: {predictions.nextQuarter}</p>
          <p>Next Year: {predictions.nextYear}</p>
        </div>
      )}
    </div>
  );
};

export default AIPredictions;
