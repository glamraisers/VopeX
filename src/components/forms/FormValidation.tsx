import React from 'react';
import styled from 'styled-components';

export interface FormValidationProps {
  error?: string;
  helperText?: string;
}

const FormValidation: React.FC<FormValidationProps> = ({
  error,
  helperText,
}) => {
  return (
    <ValidationContainer>
      {helperText && <HelperText>{helperText}</HelperText>}
      {error && <ErrorText>{error}</ErrorText>}
    </ValidationContainer>
  );
};

const ValidationContainer = styled.div`
  margin-top: 0.25rem;
`;

const HelperText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: #6c757d;
`;

const ErrorText = styled.span`
  display: block;
  font-size: 0.875rem;
  color: red;
`;

export default FormValidation;