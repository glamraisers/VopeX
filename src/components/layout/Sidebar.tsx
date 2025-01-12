import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <SidebarContainer>
      <SidebarHeader>Navigation</SidebarHeader>
      <NavList>
        <NavItem>
          <NavLink to="/">Home</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/about">About</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contact">Contact</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </NavItem>
      </NavList>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.aside`
  width: 250px;
  background-color: #f8f9fa;
  padding: 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarHeader = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NavItem = styled.li`
  margin: 0.5rem 0;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

export default Sidebar;