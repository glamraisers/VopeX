import React from 'react';
import styled from 'styled-components';

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, error }) => {
  return (
    <GroupContainer>
      <Label>{label}</Label>
      <ChildrenContainer>{children}</ChildrenContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </GroupContainer>
  );
};

const GroupContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const ChildrenContainer = styled.div`
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
`;

export default FormGroup;