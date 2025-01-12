import React from 'react';
import styled from 'styled-components';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, error, ...props }) => {
  return (
    <TextareaContainer>
      <Label>{label}</Label>
      <StyledTextarea hasError={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </TextareaContainer>
  );
};

const TextareaContainer = styled.div`
  margin-bottom: 1rem;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const StyledTextarea = styled.textarea<{ hasError: boolean }>`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ hasError }) => (hasError ? 'red' : '#ced4da')};
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical; // Allows vertical resizing

  &:focus {
    border-color: ${({ hasError }) => (hasError ? 'red' : '#80bdff')};
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
`;

export default FormTextarea;