import React from 'react';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterText>© {new Date().getFullYear()} MyApp. All rights reserved.</FooterText>
      <FooterLinks>
        <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
        <FooterLink href="/terms-of-service">Terms of Service</FooterLink>
      </FooterLinks>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #343a40;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
`;

const FooterText = styled.p`
  margin: 0;
`;

const FooterLinks = styled.div`
  margin-top: 0.5rem;
`;

const FooterLink = styled.a`
  color: #007bff;
  text-decoration: none;
  margin: 0 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;