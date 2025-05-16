import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiDollarSign, FiDownload, FiSend, FiCreditCard, FiSmartphone, FiMapPin } from 'react-icons/fi';
import theme from '../styles/theme';
import OffRampOptions from './OffRampOptions';
import { toast } from 'react-hot-toast';

interface ClaimFundsPageProps {
  onBack: () => void;
  onSubmit: (address: string, amount: string) => void;
}

// Styled components for the claim funds page
const Container = styled.div`
  padding: ${theme.spacing[4]};
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing[6]};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.gray[800]};
  padding: ${theme.spacing[2]};
  margin-left: -${theme.spacing[2]};
  border-radius: ${theme.borderRadius.full};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.gray[100]};
  }
`;

const Title = styled.h1`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-left: ${theme.spacing[2]};
`;

const Card = styled(motion.div)`
  background-color: white;
  border-radius: ${theme.borderRadius.xl};
  box-shadow: ${theme.shadows.md};
  padding: ${theme.spacing[6]};
  margin-bottom: ${theme.spacing[4]};
`;

const BalanceInfo = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary[50]}, ${theme.colors.primary[100]});
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[4]};
`;

const BalanceLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing[1]};
`;

const BalanceValue = styled.div`
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.bold};
  color: ${theme.colors.gray[900]};
`;

const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #F3E8FF;
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[4]};
`;

const InfoIcon = styled.div`
  color: ${theme.colors.primary[600]};
  margin-right: ${theme.spacing[3]};
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[800]};
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Main component
const ClaimFundsPage: React.FC<ClaimFundsPageProps> = ({ onBack, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [offrampMode, setOfframpMode] = useState(true);
  
  // Set up the temporary wallet data
  useEffect(() => {
    // Get temporary wallet data from localStorage
    const tempWalletData = localStorage.getItem('temp_wallet');
    if (tempWalletData) {
      const tempWallet = JSON.parse(tempWalletData);
      if (tempWallet.balance) {
        setAmount(tempWallet.balance);
      }
    } else {
      // No temporary wallet data found, redirect to home
      console.error("No temporary wallet data found");
      toast.error("No claimed funds found");
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
  }, []);
  
  // Handle off-ramp withdrawals
  const handleOfframpWithdraw = (amount: string, method: string, details: any) => {
    // Mock implementation
    console.log(`Off-ramp withdraw: ${amount} via ${method}`, details);
    
    // Generate withdrawal ID
    const withdrawalId = `WD${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    // Clear temporary wallet data after successful withdrawal
    setTimeout(() => {
      console.log("Clearing temporary wallet data after successful withdrawal");
      localStorage.removeItem('temp_wallet');
      
      // Update balance for the main app
      if (onSubmit) {
        onSubmit(details.accountNumber || details.phoneNumber || 'off-ramp-destination', amount);
      }
    }, 1000);
    
    return Promise.resolve({
      success: true,
      amount,
      fee: (parseFloat(amount) * 0.02).toFixed(2),
      destination: details.accountNumber || details.phoneNumber || 'your account',
      referenceCode: withdrawalId,
      estimatedTime: '1-2 business days'
    });
  };
  
  const parsedAmount = parseFloat(amount) || 0;
  
  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <FiArrowLeft size={24} />
        </BackButton>
        <Title>Claim Your Funds</Title>
      </Header>
      
      {offrampMode ? (
        <OffRampOptions 
          balance={amount}
          isTemporaryMode={true}
          onWithdraw={handleOfframpWithdraw}
          onSuccess={() => {
            // After successful withdrawal, navigate to home
            setTimeout(() => {
              window.location.href = '/';
            }, 5000);
          }}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variants={itemVariants}>
            <InfoBanner>
              <InfoIcon><FiAlertCircle size={24} /></InfoIcon>
              <InfoText>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Claimed Funds</div>
                <div>You've successfully claimed funds that were sent to you. You can now withdraw these funds to your preferred destination.</div>
              </InfoText>
            </InfoBanner>
            
            <BalanceInfo>
              <BalanceLabel>Claimed Amount</BalanceLabel>
              <BalanceValue>${parsedAmount.toFixed(2)} USD</BalanceValue>
            </BalanceInfo>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: theme.spacing[4], fontSize: theme.typography.fontSize.md }}>
                Choose how you'd like to withdraw your funds
              </div>
              
              <button
                style={{
                  width: '100%',
                  padding: theme.spacing[4],
                  backgroundColor: theme.colors.primary[600],
                  color: 'white',
                  border: 'none',
                  borderRadius: theme.borderRadius.lg,
                  fontSize: theme.typography.fontSize.md,
                  fontWeight: theme.typography.fontWeight.semibold,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  marginBottom: theme.spacing[3]
                }}
                onClick={() => setOfframpMode(true)}
              >
                <FiDownload style={{ marginRight: theme.spacing[2] }} />
                Withdraw to Bank Account or Card
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </Container>
  );
};

export default ClaimFundsPage;