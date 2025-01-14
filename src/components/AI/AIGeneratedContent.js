import React, { useState } from 'react';
import { aiService } from '../../services/aiService';

const AIGeneratedContent = () => {
  const [prompt, setPrompt] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleGenerateContent = async (e) => {
    e.preventDefault();
    try {
      const data = await aiService.generateContent(prompt);
      setContent(data.content);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="ai-generated-content">
      <h2>AI Generated Content</h2>
      <form onSubmit={handleGenerateContent}>
        <div>
          <label>Enter a prompt:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Generate</button>
      </form>
      {content && <p>Generated Content: {content}</p>}
    </div>
  );
};

export default AIGeneratedContent;