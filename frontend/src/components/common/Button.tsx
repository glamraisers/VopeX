import React from 'react';
import styled from 'styled-components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        children
      )}
    </StyledButton>
  );
};

const StyledButton = styled.button<{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  // Variant styles
  background-color: ${props => {
    switch (props.$variant) {
      case 'primary': return '#007bff';
      case 'secondary': return '#6c757d';
      case 'danger': return '#dc3545';
      case 'outline': return 'transparent';
      default: return '#007bff';
    }
  }};
  
  color: ${props => {
    switch (props.$variant) {
      case 'outline': return '#007bff';
      default: return 'white';
    }
  }};
  
  border: ${props => 
    props.$variant === 'outline' 
      ? '1px solid #007bff' 
      : 'none'
  };

  // Size styles
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '0.25rem 0.5rem';
      case 'medium': return '0.5rem 1rem';
      case 'large': return '0.75rem 1.5rem';
      default: return '0.5rem 1rem';
    }
  }};
  
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.75rem';
      case 'medium': return '1rem';
      case 'large': return '1.25rem';
      default: return '1rem';
    }
  }};

  // Full width
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  // Hover and active states
  &:hover:not(:disabled) {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default Button;