import React from 'react';
import styled from 'styled-components';

const Dashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <Title>Dashboard</Title>
      <Description>
        Welcome to your dashboard! Here you can find an overview of your activities and statistics.
      </Description>
      <StatsContainer>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <StatValue>1,234</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Active Sessions</StatTitle>
          <StatValue>456</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>New Messages</StatTitle>
          <StatValue>78</StatValue>
        </StatCard>
      </StatsContainer>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
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

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const StatCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: bold;
`;

export default Dashboard;