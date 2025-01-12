import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  background-color: ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return '#007bff';
      case 'secondary':
        return '#6c757d';
      case 'danger':
        return '#dc3545';
      default:
        return '#007bff';
    }
  }};

  &:hover {
    background-color: ${({ variant }) => {
      switch (variant) {
        case 'primary':
          return '#0056b3';
        case 'secondary':
          return '#5a6268';
        case 'danger':
          return '#c82333';
        default:
          return '#0056b3';
      }
    }};
  }
`;

export default Button;