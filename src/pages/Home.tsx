import React from 'react';
import styled from 'styled-components';

const Home: React.FC = () => {
  return (
    <HomeContainer>
      <Title>Welcome to MyApp</Title>
      <Description>
        This is the home page of your application. Here you can find the latest updates and features.
      </Description>
      <FeaturesList>
        <FeatureItem>Feature 1: User-friendly interface</FeatureItem>
        <FeatureItem>Feature 2: Responsive design</FeatureItem>
        <FeatureItem>Feature 3: Easy navigation</FeatureItem>
      </FeaturesList>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
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

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
`;

const FeatureItem = styled.li`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

export default Home;