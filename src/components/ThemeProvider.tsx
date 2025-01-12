import React from 'react';
import { createGlobalStyle, ThemeProvider as StyledThemeProvider } from 'styled-components';

interface Theme {
  primaryColor: string;
  secondaryColor: string;
  errorColor: string;
  successColor: string;
}

const theme: Theme = {
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
  errorColor: '#dc3545',
  successColor: '#28a745',
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #f8f9fa;
    color: #212529;
  }
`;

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  );
};

export default ThemeProvider;