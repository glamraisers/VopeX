import React from 'react';
import styled, { keyframes } from 'styled-components';

export interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'medium',
  color = '#007bff',
  fullScreen = false
}) => {
  return (
    <SpinnerContainer $fullScreen={fullScreen}>
      <SpinnerElement 
        $size={size} 
        $color={color} 
      />
    </SpinnerContainer>
  );
};

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ $fullScreen: boolean }>`
  ${props => props.$fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  `}
`;

const SpinnerElement = styled.div<{ 
  $size: string; 
  $color: string; 
}>`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${props => props.$color};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;

  width: ${props => {
    switch (props.$size) {
      case 'small': return '20px';
      case 'medium': return '40px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};

  height: ${props => {
    switch (props.$size) {
      case 'small': return '20px';
      case 'medium': return '40px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
`;

export default Spinner;