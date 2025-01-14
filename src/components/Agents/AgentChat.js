import React, { useState } from 'react';
import { agentService } from '../../services/agentService';

const AgentChat = ({ agentId }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');

  const handleSendMessage = async () => {
    try {
      const response = await agentService.sendMessage(agentId, message);
      setChatHistory([...chatHistory, { sender: 'agent', message }]);
      setMessage('');
      // Handle response (e.g., update chat history)
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="agent-chat">
      <h2>Agent Chat</h2>
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender}`}>
            <p>{chat.message}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AgentChat;
