import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiAlertCircle, FiDollarSign, FiSend, FiCreditCard, FiSmartphone, FiMapPin } from 'react-icons/fi';
import theme from '../../styles/theme';
import OffRampOptions from '../OffRampOptions';

interface WithdrawScreenProps {
  balance: string;
  onBack: () => void;
  onSubmit: (address: string, amount: string) => void;
}

// Styled components for the withdraw screen
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing[4]} ${theme.spacing[4]};
  background-color: ${theme.colors.gray[50]};
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[5]};
`;

const BalanceLabel = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[600]};
`;

const BalanceValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.gray[900]};
`;

const FormGroup = styled.div`
  margin-bottom: ${theme.spacing[5]};
`;

const Label = styled.label`
  display: block;
  font-weight: ${theme.typography.fontWeight.medium};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[800]};
  margin-bottom: ${theme.spacing[2]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing[3]};
  font-size: ${theme.typography.fontSize.md};
  border: 1px solid ${theme.colors.gray[300]};
  border-radius: ${theme.borderRadius.md};
  background-color: white;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const AmountPrefix = styled.div`
  position: absolute;
  top: 50%;
  left: ${theme.spacing[3]};
  transform: translateY(-50%);
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSize.md};
`;

const AmountInput = styled(Input)`
  padding-left: 1.75rem; /* Using fixed value instead of theme.spacing[7] which doesn't exist */
`;

const MaxButton = styled.button`
  position: absolute;
  top: 50%;
  right: ${theme.spacing[3]};
  transform: translateY(-50%);
  background-color: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  border: none;
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.medium};
  cursor: pointer;
  
  &:hover {
    background-color: ${theme.colors.primary[200]};
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(135deg, ${theme.colors.primary[600]}, ${theme.colors.primary[800]});
  color: white;
  border: none;
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${theme.shadows.md};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: linear-gradient(135deg, ${theme.colors.gray[400]}, ${theme.colors.gray[500]});
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  svg {
    margin-right: ${theme.spacing[2]};
  }
`;

const WarningBanner = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: ${theme.colors.status.warning}10;
  border-left: 4px solid ${theme.colors.status.warning};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.md};
  margin-top: ${theme.spacing[4]};
`;

const WarningIcon = styled.div`
  color: ${theme.colors.status.warning};
  margin-right: ${theme.spacing[2]};
  flex-shrink: 0;
  margin-top: 2px;
`;

const WarningText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.gray[800]};
  margin: 0;
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
const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ balance, onBack, onSubmit }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [showOffRamp, setShowOffRamp] = useState(false);
  const [isTemporaryWallet, setIsTemporaryWallet] = useState(false);
  const numericBalance = parseFloat(balance) || 0;
  
  // Check if we're in temporary wallet mode (from URL params or localStorage)
  // Temp wallets only appear after claiming funds and are used for off-ramping
  useEffect(() => {
    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const isTemp = params.get('temp') === 'true';
    const tempAmount = params.get('amount');
    const directOfframp = params.get('direct_offramp') === 'true';
    
    // Or check localStorage
    const tempWalletData = localStorage.getItem('temp_wallet');
    const tempWallet = tempWalletData ? JSON.parse(tempWalletData) : null;
    
    if (isTemp || tempWallet?.isTemporary) {
      setIsTemporaryWallet(true);
      console.log("TEMPORARY WALLET MODE ENABLED");
      
      // Set initial amount if provided in URL or in tempWallet
      if (tempAmount) {
        setAmount(tempAmount);
      } else if (tempWallet?.balance) {
        setAmount(tempWallet.balance);
      }
      
      // If direct_offramp flag is set, show the off-ramp interface immediately
      // This is for the temporary wallet flow after claiming funds
      if (directOfframp) {
        setShowOffRamp(true);
        console.log("Direct off-ramp mode enabled");
      }
    } else {
      console.log("Regular wallet mode");
    }
  }, []);
  
  // Check if form is valid
  const isFormValid = () => {
    return address.trim() !== '' && 
           amount.trim() !== '' && 
           parseFloat(amount) > 0 && 
           parseFloat(amount) <= numericBalance;
  };
  
  // Handle max amount
  const setMaxAmount = () => {
    // If it's a temporary wallet, use the full amount
    // Otherwise, leave a small amount for transaction fees
    if (isTemporaryWallet) {
      setAmount(numericBalance.toFixed(2));
    } else {
      // Leave a small amount for transaction fees
      const maxAmount = Math.max(0, numericBalance - 0.1).toFixed(2);
      setAmount(maxAmount);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(address, amount);
      
      // If this is a temporary wallet, clear the data after submission
      if (isTemporaryWallet) {
        // Small delay to allow the animation and updates to process
        setTimeout(() => {
          localStorage.removeItem('temp_wallet');
          // Go to home after successful withdrawal from temp wallet
          window.location.href = '/';
        }, 2000);
      }
    }
  };
  
  // Handle showing offramp options vs. traditional withdraw
  const toggleView = () => {
    setShowOffRamp(!showOffRamp);
  };
  
  // Handle offramp withdraw
  const handleOfframpWithdraw = (amount: string, method: string, details: any) => {
    // Mock implementation that will simulate a withdrawal
    console.log(`Offramp withdraw: ${amount} via ${method}`, details);
    
    // Update the balance by simulating a withdrawal
    setTimeout(() => {
      // For regular wallets, update the balance
      if (!isTemporaryWallet) {
        onSubmit(details.accountNumber || details.phoneNumber || 'off-ramp-destination', amount);
      } else {
        // For temporary wallets, clear the temp wallet data after withdrawal
        console.log("Clearing temporary wallet data after successful withdrawal");
        localStorage.removeItem('temp_wallet');
      }
    }, 1000);
    
    // Create mock withdrawal result
    const withdrawalId = `WD${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    console.log(`Generated withdrawal ID: ${withdrawalId} for ${isTemporaryWallet ? 'temporary' : 'regular'} wallet`);
    
    return Promise.resolve({
      success: true,
      amount,
      fee: (parseFloat(amount) * 0.02).toFixed(2),
      destination: details.accountNumber || details.phoneNumber || 'your account',
      referenceCode: withdrawalId,
      estimatedTime: '1-2 business days',
      isTemporaryWallet: isTemporaryWallet
    });
  };
  
  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          <FiArrowLeft size={24} />
        </BackButton>
        <Title>Withdraw Funds</Title>
      </Header>
      
      {showOffRamp || isTemporaryWallet ? (
        <OffRampOptions 
          balance={isTemporaryWallet ? amount : balance} 
          walletAddress={address}
          isTemporaryWallet={isTemporaryWallet}
          onWithdraw={handleOfframpWithdraw}
          onSuccess={() => {
            // After successful withdrawal, clear temp wallet and navigate back
            if (isTemporaryWallet) {
              localStorage.removeItem('temp_wallet');
              setTimeout(() => {
                window.location.href = '/';
              }, 5000);
            } else {
              setTimeout(() => {
                onBack();
              }, 5000);
            }
          }}
        />
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card variants={itemVariants}>
            {!isTemporaryWallet && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontWeight: 'bold' }}>Method:</div>
                <div>
                  <button 
                    onClick={toggleView}
                    style={{
                      background: 'linear-gradient(135deg, #7C3AED, #4C1D95)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Try Fiat Off-Ramp Options →
                  </button>
                </div>
              </div>
            )}
            

            <form onSubmit={handleSubmit}>
              <BalanceInfo>
                <BalanceLabel>Available Balance</BalanceLabel>
                <BalanceValue>{numericBalance.toFixed(7)} XLM (≈ ${(numericBalance * 0.15).toFixed(2)} USD)</BalanceValue>
              </BalanceInfo>
              
              <FormGroup>
                <Label htmlFor="recipient-address">Recipient Address</Label>
                <Input 
                  id="recipient-address"
                  type="text" 
                  placeholder="G..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="amount">Amount</Label>
                <InputGroup>
                  <AmountPrefix>
                    <FiDollarSign />
                  </AmountPrefix>
                  <AmountInput 
                    id="amount"
                    type="number" 
                    step="0.01" 
                    min="0" 
                    max={numericBalance}
                    placeholder="0.00" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <MaxButton type="button" onClick={setMaxAmount}>MAX</MaxButton>
                </InputGroup>
              </FormGroup>
              
              <SubmitButton 
                type="submit" 
                disabled={!isFormValid()}
                whileHover={{ scale: isFormValid() ? 1.03 : 1 }}
                whileTap={{ scale: isFormValid() ? 0.98 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FiSend size={18} />
                {isTemporaryWallet ? 'Withdraw Claimed Funds' : 'Withdraw Funds'}
              </SubmitButton>
              
              <WarningBanner>
                <WarningIcon><FiAlertCircle size={18} /></WarningIcon>
                <WarningText>
                  Always double-check the recipient address before submitting. Transactions on the Stellar network cannot be reversed once confirmed.
                </WarningText>
              </WarningBanner>
            </form>
          </Card>
        </motion.div>
      )}
    </Container>
  );
};

export default WithdrawScreen;