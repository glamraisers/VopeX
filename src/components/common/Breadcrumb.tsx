import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface BreadcrumbProps {
  items: { label: string; path: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <BreadcrumbContainer>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem to={item.path}>{item.label}</BreadcrumbItem>
          {index < items.length - 1 && <Separator>/</Separator>}
        </React.Fragment>
      ))}
    </BreadcrumbContainer>
  );
};

const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  margin: 1rem 0;
`;

const BreadcrumbItem = styled(Link)`
  color: #007bff; /* Primary color */
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Separator = styled.span`
  margin: 0 0.5rem;
`;

export default Breadcrumb;