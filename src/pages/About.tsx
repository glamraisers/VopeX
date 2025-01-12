import React from 'react';
import styled from 'styled-components';

const About: React.FC = () => {
  return (
    <AboutContainer>
      <Title>About MyApp</Title>
      <Description>
        MyApp is a powerful application designed to help you manage your tasks efficiently. 
        Our goal is to provide a user-friendly experience with a focus on productivity.
      </Description>
      <TeamSection>
        <TeamTitle>Meet the Team</TeamTitle>
        <TeamList>
          <TeamMember>John Doe - CEO</TeamMember>
          <TeamMember>Jane Smith - CTO</TeamMember>
          <TeamMember>Emily Johnson - Lead Developer</TeamMember>
        </TeamList>
      </TeamSection>
    </AboutContainer>
  );
};

const AboutContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
`;

const TeamSection = styled.div`
  margin-top: 2rem;
`;

const TeamTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const TeamList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TeamMember = styled.li`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

export default About;