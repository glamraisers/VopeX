import React from 'react';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; {new Date().getFullYear()} MyApp. All rights reserved.</p>
        <Links>
          <LinkItem href="/privacy-policy">Privacy Policy</LinkItem>
          <LinkItem href="/terms-of-service">Terms of Service</LinkItem>
          <LinkItem href="/contact">Contact Us</LinkItem>
        </Links>
      </FooterContent>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #343a40; /* Dark background */
  color: white;
  padding: 1rem 0;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Links = styled.div`
  margin-top: 0.5rem;
`;

const LinkItem = styled.a`
  color: white;
  text-decoration: none;
  margin: 0 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default Footer;