import React from 'react';
import styled from 'styled-components';

interface CardProps {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <CardContainer>
      <CardHeader>{title}</CardHeader>
      <CardBody>{children}</CardBody>
      {footer && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 1rem;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  font-weight: bold;
  border-bottom: 1px solid #e9ecef;
`;

const CardBody = styled.div`
  padding: 1rem;
`;

const CardFooter = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
`;

export default Card;