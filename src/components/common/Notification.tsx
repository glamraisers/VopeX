import React from 'react';
import styled from 'styled-components';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  return (
    <NotificationContainer type={type}>
      <Message>{message}</Message>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </NotificationContainer>
  );
};

const NotificationContainer = styled.div<{ type: 'success' | 'error' | 'info' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  color: white;
  background-color: ${({ type }) => {
    switch (type) {
      case 'success':
        return '#28a745'; // Green
      case 'error':
        return '#dc3545'; // Red
      case 'info':
        return '#17a2b8'; // Blue
      default:
        return '#6c757d'; // Gray
    }
  }};
`;

const Message = styled.span`
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;

export default Notification;