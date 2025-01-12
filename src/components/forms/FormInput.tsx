import React from 'react';
import styled from 'styled-components';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  helperText,
  required,
  ...props
}) => {
  return (
    <InputContainer>
      {label && (
        <Label>
          {label}
          {required && <RequiredIndicator>*</RequiredIndicator>}
        </Label>
      )}
      <StyledInput {...props} />
      {helperText && <HelperText>{helperText}</HelperText>}
      {error && <ErrorText>{error}</ErrorText>}
    </InputContainer>
  );
};

const InputContainer = styled.div`
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

const StyledInput = styled.input`
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

export default FormInput;