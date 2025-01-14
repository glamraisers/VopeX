import React, { useState } from 'react';
import { aiService } from '../../services/aiService';

const AIBot = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    try {
      const data = await aiService.queryBot(query);
      setResponse(data.response);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="ai-bot">
      <h2>AI Bot</h2>
      <form onSubmit={handleQuery}>
        <div>
          <label>Ask a question:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Ask</button>
      </form>
      {response && <p>Response: {response}</p>}
    </div>
  );
};

export default AIBot;
