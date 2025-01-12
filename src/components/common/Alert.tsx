import React from 'react';
import styled from 'styled-components';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  return (
    <AlertContainer type={type}>
      <Message>{message}</Message>
      {onClose && <CloseButton onClick={onClose}>&times;</CloseButton>}
    </AlertContainer>
  );
};

const AlertContainer = styled.div<{ type: 'success' | 'error' | 'info' }>`
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export default Alert;