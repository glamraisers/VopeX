import React from 'react';
import styled from 'styled-components';

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  className,
  hoverable = false
}) => {
  return (
    <StyledCard className={className} $hoverable={hoverable}>
      {title && <CardHeader>{title}</CardHeader>}
      <CardContent>{children}</CardContent>
    </StyledCard>
  );
};

const StyledCard = styled.div<{ $hoverable: boolean }>`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  ${props => props.$hoverable && `
    &:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-5px);
    }
  `}
`;

const CardHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
  font-size: 1.1rem;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

export default Card;