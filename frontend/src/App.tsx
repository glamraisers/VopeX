import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy-loaded pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Leads = React.lazy(() => import('./pages/Leads'));
const Opportunities = React.lazy(() => import('./pages/Opportunities'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// Core components
import QuantumLayout from './components/core/QuantumLayout';
import LoadingSpinner from './components/common/LoadingSpinner';

const App: React.FC = () => {
  return (
    <QuantumLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </QuantumLayout>
  );
};

export default App;