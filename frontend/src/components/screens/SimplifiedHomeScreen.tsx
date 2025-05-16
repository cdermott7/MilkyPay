import React from 'react';
import styled from 'styled-components';
import * as FaIcons from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import ChatWidget from '../ChatWidget';

// Simple styled components (with fewer theme properties that could cause errors)
const Container = styled.div<{ isDark?: boolean }>`
  padding: 20px;
  width: 100%;
  max-width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  color: ${props => props.isDark ? 'white' : '#333'};

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GreetingContainer = styled.div``;

const Greeting = styled.h2<{ isDark?: boolean }>`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 5px;
  color: ${props => props.isDark ? 'white' : 'inherit'};
`;

const SubGreeting = styled.p<{ isDark?: boolean }>`
  font-size: 14px;
  color: ${props => props.isDark ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  margin: 0;
`;

const ThemeToggle = styled.button`
  width: 40px;
  height: 40px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #F59E0B;
  
  &:hover {
    background: #f9f9f9;
  }
`;

const BalanceCard = styled.div`
  background: #7C3AED;
  border-radius: 16px;
  padding: 25px;
  color: white;
  margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const BalanceLabel = styled.div`
  font-size: 14px;
  opacity: 0.8;
`;

const BalanceAmount = styled.div`
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 5px;
  display: flex;
  align-items: baseline;
`;

const CurrencySymbol = styled.span`
  font-size: 24px;
  margin-right: 5px;
`;

const XLMLabel = styled.span`
  font-size: 18px;
  opacity: 0.8;
  margin-left: 10px;
`;

const USDValue = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const SectionTitle = styled.h3<{ isDark?: boolean }>`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.isDark ? 'white' : '#333'};
  margin-bottom: 15px;
  margin-top: 20px;
`;

const ActionButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const ActionButton = styled.button<{ isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.05)' : 'white'};
  border: 1px solid ${props => props.isDark ? 'rgba(124, 58, 237, 0.3)' : '#eee'};
  border-radius: 12px;
  padding: 15px 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.isDark ? 'white' : 'inherit'};
  backdrop-filter: ${props => props.isDark ? 'blur(10px)' : 'none'};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrapper = styled.div<{ isDark?: boolean }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => props.isDark ? 'rgba(124, 58, 237, 0.2)' : '#f3f4f6'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: ${props => props.isDark ? 'white' : '#7C3AED'};
  box-shadow: ${props => props.isDark ? '0 0 10px rgba(124, 58, 237, 0.3)' : 'none'};
`;

const ActionLabel = styled.span<{ isDark?: boolean }>`
  font-weight: 500;
  color: ${props => props.isDark ? 'white' : '#333'};
  font-size: 14px;
`;

const ChatSection = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 10px 0;
  width: 100%;
`;

const QuickActionsContainer = styled.div`
  margin-top: auto;
  margin-bottom: 20px;
`;

const QuickActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const QuickActionButton = styled.button<{ isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${props => props.isDark ? 'rgba(255, 255, 255, 0.03)' : 'transparent'};
  border: 1px solid ${props => props.isDark ? 'rgba(124, 58, 237, 0.2)' : '#eee'};
  border-radius: 12px;
  padding: 12px;
  flex: 1;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.isDark ? 'rgba(124, 58, 237, 0.1)' : '#f9f9f9'};
    border-color: ${props => props.isDark ? 'rgba(124, 58, 237, 0.4)' : '#eee'};
    box-shadow: ${props => props.isDark ? '0 0 15px rgba(124, 58, 237, 0.2)' : 'none'};
    transform: ${props => props.isDark ? 'translateY(-2px)' : 'none'};
  }
`;

const QuickActionIcon = styled.div`
  color: #7C3AED;
  font-size: 20px;
  margin-bottom: 8px;
`;

const QuickActionLabel = styled.span`
  font-size: 12px;
  color: #666;
`;

interface SimplifiedHomeScreenProps {
  balance: string;
  ftnBalance?: string;
  username?: string;
  walletAddress?: string;
  onNavigate: (screen: string) => void;
  onSendMoney?: (amount: string, recipient: string) => Promise<void>;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const SimplifiedHomeScreen: React.FC<SimplifiedHomeScreenProps> = ({
  balance,
  ftnBalance = '0',
  username = 'there',
  walletAddress = '',
  onNavigate,
  onSendMoney,
  isDarkMode = false,
  onToggleTheme = () => {}
}) => {
  // For display, we'll keep both USD and XLM
  const numericBalance = parseFloat(balance) || 0;
  // XLM is the native balance we have from the wallet
  const xlmValue = numericBalance.toFixed(7); // Full XLM precision
  // Convert XLM to USD (using 1 XLM = $0.15 USD as a sample rate)
  const usdValue = (numericBalance * 0.15).toFixed(2);
  
  return (
    <Container isDark={isDarkMode}>
      <Header>
        <GreetingContainer>
          <Greeting isDark={isDarkMode}>Hello, {username}</Greeting>
          <SubGreeting isDark={isDarkMode}>Welcome back to MilkyPay</SubGreeting>
        </GreetingContainer>
        <ThemeToggle onClick={onToggleTheme}>
          {isDarkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
        </ThemeToggle>
      </Header>
      
      <BalanceCard>
        <BalanceLabel>Current Balance</BalanceLabel>
        <BalanceAmount>
          <CurrencySymbol>$</CurrencySymbol>
          {usdValue}
          <XLMLabel>USD</XLMLabel>
        </BalanceAmount>
        <USDValue>{xlmValue} XLM · Stellar Network</USDValue>
        <USDValue>{ftnBalance} FTN · Bahamut Network</USDValue>
        <USDValue style={{ fontSize: '12px', marginTop: '5px' }}>Self-Custodial Wallet</USDValue>
      </BalanceCard>
      
      <SectionTitle isDark={isDarkMode}>Actions</SectionTitle>
      <ActionButtonsContainer>
        <ActionButton onClick={() => onNavigate('deposit')} isDark={isDarkMode}>
          <IconWrapper isDark={isDarkMode}>
            <FaIcons.FaRocket size={20} />
          </IconWrapper>
          <ActionLabel isDark={isDarkMode}>Deposit</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={() => onNavigate('withdraw')} isDark={isDarkMode}>
          <IconWrapper isDark={isDarkMode}>
            <FaIcons.FaArrowUp size={20} />
          </IconWrapper>
          <ActionLabel isDark={isDarkMode}>Withdraw</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={() => onNavigate('transfer')} isDark={isDarkMode}>
          <IconWrapper isDark={isDarkMode}>
            <FaIcons.FaExchangeAlt size={20} />
          </IconWrapper>
          <ActionLabel isDark={isDarkMode}>Transfer</ActionLabel>
        </ActionButton>
        
        <ActionButton onClick={() => onNavigate('purchase')} isDark={isDarkMode}>
          <IconWrapper isDark={isDarkMode}>
            <FaIcons.FaCoins size={20} />
          </IconWrapper>
          <ActionLabel isDark={isDarkMode}>Purchase</ActionLabel>
        </ActionButton>
      </ActionButtonsContainer>
      
      <SectionTitle isDark={isDarkMode}>AI Assistant</SectionTitle>
      <ChatSection>
        <ChatWidget
          walletBalance={balance}
          walletFtnBalance={ftnBalance}
          walletAddress={walletAddress}
          onSendMoney={onSendMoney}
          fallbackVoiceInput={input => {
            return new Promise(resolve => {
              const message = prompt('Speech recognition unavailable. What would you like to say?') || '';
              resolve(message);
            });
          }}
        />
      </ChatSection>
      
      <Divider />
      
      <QuickActionsContainer>
        <SectionTitle isDark={isDarkMode}>Quick Access</SectionTitle>
        <QuickActionButtons>
          <QuickActionButton onClick={() => onNavigate('history')} isDark={isDarkMode}>
            <QuickActionIcon>
              <FaIcons.FaHistory />
            </QuickActionIcon>
            <QuickActionLabel>History</QuickActionLabel>
          </QuickActionButton>
          
          <QuickActionButton onClick={() => onNavigate('recurring')} isDark={isDarkMode}>
            <QuickActionIcon>
              <FaIcons.FaCalendarAlt />
            </QuickActionIcon>
            <QuickActionLabel>Recurring</QuickActionLabel>
          </QuickActionButton>
          
          <QuickActionButton onClick={() => onNavigate('profile')} isDark={isDarkMode}>
            <QuickActionIcon>
              <FaIcons.FaUserAstronaut />
            </QuickActionIcon>
            <QuickActionLabel>Profile</QuickActionLabel>
          </QuickActionButton>
          
          <QuickActionButton onClick={() => onNavigate('settings')} isDark={isDarkMode}>
            <QuickActionIcon>
              <FaIcons.FaCog />
            </QuickActionIcon>
            <QuickActionLabel>Settings</QuickActionLabel>
          </QuickActionButton>
        </QuickActionButtons>
      </QuickActionsContainer>
    </Container>
  );
};

export default SimplifiedHomeScreen;