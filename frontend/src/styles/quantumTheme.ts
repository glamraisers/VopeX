import { DefaultTheme } from 'styled-components';

export const quantumTheme: DefaultTheme = {
  colors: {
    primary: {
      base: '#3A66FF',
      light: '#6A8AFF',
      dark: '#1A3C99'
    },
    secondary: {
      base: '#6A5ACD',
      light: '#8C7AEF',
      dark: '#4B3A8F'
    },
    background: {
      primary: '#0F1020',
      secondary: '#1A1A2E'
    },
    text: {
      primary: '#E0E0E0',
      secondary: '#A0A0A0'
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: {
      small: '0.8rem',
      medium: '1rem',
      large: '1.2rem'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  }
};