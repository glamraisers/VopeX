import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo to="/">MyApp</Logo>
      <Nav>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/about">About</NavItem>
        <NavItem to="/contact">Contact</NavItem>
      </Nav>
    </HeaderContainer>
  );
};

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #007bff;
  color: white;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

const Nav = styled.nav`
  display: flex;
`;

const NavItem = styled(Link)`
  margin-left: 1.5rem;
  text-decoration: none;
  color: white;

  &:hover {
    text-decoration: underline;
  }
`;

export default Header;