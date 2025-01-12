import React, { useState } from 'react';
import styled from 'styled-components';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <TabButton isActive={isActive} onClick={onClick}>
      {label}
    </TabButton>
  );
};

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 1rem;
  background: ${({ isActive }) => (isActive ? '#007bff' : 'transparent')}; /* Primary color */
  color: ${({ isActive }) => (isActive ? 'white' : '#007bff')};
  border: none;
  border-bottom: 2px solid ${({ isActive }) => (isActive ? '#0056b3' : 'transparent')}; /* Darker shade */
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: ${({ isActive }) => (isActive ? '#0056b3' : '#f1f1f1')};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
`;

const TabContent = styled.div`
  padding: 1rem;
`;

interface TabsProps {
  tabs: { label: string; content: React.ReactNode }[];
}

const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <TabsContainer>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            isActive={activeTab === index}
            onClick={() => setActiveTab(index)}
          />
        ))}
      </TabsContainer>
      <TabContent>{tabs[activeTab].content}</TabContent>
    </div>
  );
};

export default Tabs;