import React from 'react';
import styled from 'styled-components';

interface FormRadioProps {
  label: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const FormRadio: React.FC<FormRadioProps> = ({ label, name, value, checked, onChange, error }) => {
  return (
    <RadioContainer>
      <StyledRadio
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <Label>{label}</Label>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </RadioContainer>
  );
};

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const StyledRadio = styled.input`
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

export default FormRadio;