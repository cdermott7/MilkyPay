import React from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import App from './App';
import ClaimPage from './components/ClaimPage';
import ClaimFundsPage from './components/ClaimFundsPage';
import TestSMSPage from './components/TestSMSPage';

// Main router component
const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/claim/:claimId" element={<ClaimWrapper />} />
        <Route path="/claim-funds" element={<ClaimFundsWrapper />} />
        <Route path="/test-sms" element={<TestSMSPage />} />
      </Routes>
    </BrowserRouter>
  );
};

// Wrapper for the claim route to handle parameters
const ClaimWrapper: React.FC = () => {
  const { claimId } = useParams<{ claimId: string }>();
  const navigate = useNavigate();
  
  // Handle claim completion
  const handleClaimComplete = () => {
    navigate('/');
  };
  
  return (
    <ClaimPage 
      claimId={claimId || ''} 
      onComplete={handleClaimComplete} 
    />
  );
};

// Wrapper for the claim funds route to handle parameters
const ClaimFundsWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Get amount from URL params
  const amount = queryParams.get('amount') || '';
  
  // Handle completion (should be handled by the component)
  const handleComplete = () => {
    navigate('/');
  };
  
  // Dummy submit handler that won't be used
  const handleSubmit = () => {};
  
  return (
    <ClaimFundsPage
      onBack={handleComplete}
      onSubmit={handleSubmit}
    />
  );
};

export default Router;