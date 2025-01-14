import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/aiService';

const SelfLearning = () => {
  const [learningStatus, setLearningStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const startLearning = async () => {
      try {
        const status = await aiService.startLearning();
        setLearningStatus(status);
      } catch (err) {
        setError(err.message);
      }
    };

    startLearning();
  }, []);

  return (
    <div className="self-learning">
      <h2>Self-Learning AI</h2>
      {error && <p className="error">{error}</p>}
      {learningStatus && <p>Learning Status: {learningStatus}</p>}
    </div>
  );
};

export default SelfLearning;
