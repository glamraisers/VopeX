import React from 'react';
import styled from 'styled-components';

interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormCheckbox: React.FC<FormCheckboxProps> = ({ label, error, ...props }) => {
  return (
    <CheckboxContainer>
      <StyledCheckbox type="checkbox" {...props} />
      <Label>{label}</Label>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </CheckboxContainer>
  );
};

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const StyledCheckbox = styled.input`
  margin-right: 0.5rem;
`;

const Label = styled.label`
  font-weight: normal;
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
  margin-left: 0.5rem;
`;

export default FormCheckbox;