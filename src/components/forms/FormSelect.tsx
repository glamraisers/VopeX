import React from 'react';
import styled from 'styled-components';

export interface Option {
  value: string;
  label: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
  required?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  options,
  error,
  helperText,
  required,
  ...props
}) => {
  return (
    <SelectContainer>
      {label && (
        <Label>
          {label}
          {required && <RequiredIndicator>*</RequiredIndicator>}
        </Label>
      )}
      <StyledSelect {...props}>
        <option value="" disabled>Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {helperText && <HelperText>{helperText}</HelperText>}
      {error && <ErrorText>{error}</ErrorText>}
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const RequiredIndicator = styled.span`
  color: red;
  margin-left: 0.25rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    border-color: #007bff;
    outline: none;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const HelperText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #6c757d;
  margin-top: 0.25rem;
`;

const ErrorText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: red;
  margin-top: 0.25rem;
`;

export default FormSelect;