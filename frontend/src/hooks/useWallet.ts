import { useState, useEffect, useCallback } from 'react';
import * as StellarSdk from 'stellar-sdk';
import { Keypair } from 'stellar-sdk';
import { toast } from 'react-hot-toast';
import { sendClaimLinkSMS } from '../services/sms';

// Fix Server import by creating type alias
type Server = StellarSdk.Horizon.Server; 
const Server = StellarSdk.Horizon.Server;

// Wallet State
interface WalletState {
  publicKey: string;
  isEncrypted: boolean;
}

// Temporary environment variables - in a real app, these would be stored in .env
const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

// Local storage keys
const WALLET_KEY = 'bridgebotpay_wallet';
const ENCRYPTED_SECRET_KEY = 'bridgebotpay_encrypted_secret';

/**
 * Hook for managing a Stellar wallet
 * Provides wallet creation, encryption, and transaction functionality
 */
export const useWallet = () => {
  // Wallet state
  const [wallet, setWallet] = useState<WalletState | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [ftnBalance, setFtnBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Stellar SDK initialization
  const server = new Server(HORIZON_URL);
  
  // Initialize wallet from local storage
  useEffect(() => {
    const loadWallet = async () => {
      try {
        setIsLoading(true);
        setLoadingStatus('Loading wallet...');
        
        // Check for existing wallet in local storage
        const storedWallet = localStorage.getItem(WALLET_KEY);
        const encryptedSecret = localStorage.getItem(ENCRYPTED_SECRET_KEY);
        
        if (storedWallet && encryptedSecret) {
          console.log('Found existing wallet in localStorage');
          
          // Parse the wallet data
          const walletData = JSON.parse(storedWallet) as WalletState;
          setWallet(walletData);
          
          // For demo purposes, we're storing the secret in an "encrypted" form
          // In a real app, you'd use proper encryption with the user's PIN/password
          const decryptedSecret = atob(encryptedSecret);
          setSecretKey(decryptedSecret);
          
          // Load the account balance
          await fetchBalance(walletData.publicKey);
        } else {
          console.log('No existing wallet found, ready to create new wallet');
          // No wallet found, but this isn't an error condition
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error loading wallet:', err);
        setError('Failed to load wallet. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWallet();
  }, []);
  
  /**
   * Create a new Stellar wallet
   */
  const createWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadingStatus('Generating new keypair...');
      console.log('Creating new Stellar wallet...');
      
      // Generate a new keypair
      const keypair = Keypair.random();
      const publicKey = keypair.publicKey();
      const secret = keypair.secret();
      
      console.log('Generated new keypair with public key:', publicKey);
      
      // For demo, we'll store the secret with base64 encoding
      // In a real app, use proper encryption (e.g., AES with the user's PIN/password)
      const encryptedSecret = btoa(secret);
      
      // Create the wallet state
      const newWallet: WalletState = {
        publicKey,
        isEncrypted: true,
      };
      
      // Save to local storage
      localStorage.setItem(WALLET_KEY, JSON.stringify(newWallet));
      localStorage.setItem(ENCRYPTED_SECRET_KEY, encryptedSecret);
      console.log('Wallet saved to localStorage');
      
      // Update state
      setWallet(newWallet);
      setSecretKey(secret);
      
      // For demo purposes, let's set a mock balance if we can't fund with Friendbot
      let fundingSuccess = false;
      
      try {
        // Fund the account using Friendbot (testnet only)
        setLoadingStatus('Funding account with Friendbot...');
        await fundTestAccount(publicKey);
        fundingSuccess = true;
      } catch (fundingErr) {
        console.error('Failed to fund with Friendbot:', fundingErr);
        setLoadingStatus('Using mock funding for demo...');
        // Setting a mock balance without actually funding the account
        // This allows the demo to work even if Friendbot is unavailable
        setBalance('10000.0000000');
      }
      
      if (fundingSuccess) {
        // Fetch initial balance
        await fetchBalance(publicKey);
      }
      
      return newWallet;
    } catch (err) {
      console.error('Error creating wallet:', err);
      setError('Failed to create wallet. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Fund a testnet account using Friendbot
   */
  const fundTestAccount = useCallback(async (publicKey: string) => {
    try {
      setLoadingStatus('Funding account with Friendbot...');
      
      // Use fetch directly for Friendbot (simpler than the SDK method)
      const response = await fetch(
        `https://friendbot.stellar.org?addr=${encodeURIComponent(publicKey)}`
      );
      
      if (!response.ok) {
        throw new Error('Funding account failed');
      }
      
      // Let the network catch up
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (err) {
      console.error('Friendbot funding error:', err);
      toast.error('Failed to fund testnet account');
      throw err;
    }
  }, []);
  
  /**
   * Fetch the account balance
   */
  const fetchBalance = useCallback(async (accountId: string) => {
    try {
      setLoadingStatus('Fetching account balance...');
      console.log(`Fetching balance for account ID: ${accountId}`);
      
      if (!accountId || accountId.trim() === '') {
        console.error('Invalid account ID provided');
        return '0';
      }
      
      // Try loading the account data with retries
      let account;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          account = await server.loadAccount(accountId);
          console.log('Account loaded successfully');
          break;
        } catch (loadError) {
          retryCount++;
          console.warn(`Error loading account (attempt ${retryCount}/${maxRetries}):`, loadError);
          
          if (retryCount >= maxRetries) {
            throw loadError;
          }
          
          // Wait before retrying (exponential backoff)
          const delay = 500 * Math.pow(2, retryCount);
          console.log(`Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      if (!account) {
        throw new Error('Could not load account after retries');
      }
      
      // Find the XLM balance
      const xlmBalance = account.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );
      
      const balanceValue = xlmBalance ? xlmBalance.balance : '0';
      console.log(`Raw balance from network: ${balanceValue}`);
      
      // Set balance state
      const numericBalance = parseFloat(balanceValue);
      // Ensure we always have 7 decimal places for XLM
      const formattedBalance = numericBalance.toFixed(7);
      
      setBalance(formattedBalance);
      console.log(`Updated XLM balance state to: ${formattedBalance} (raw: ${balanceValue})`);
      
      // Calculate FTN balance (FastToken on Bahamut network)
      // For the demo, we'll use a conversion rate of 1 XLM = 5 FTN
      const FTN_CONVERSION_RATE = 5.0; // 1 XLM = 5 FTN
      const ftnNumericBalance = numericBalance * FTN_CONVERSION_RATE;
      const formattedFtnBalance = ftnNumericBalance.toFixed(7);
      
      setFtnBalance(formattedFtnBalance);
      console.log(`Updated FTN balance state to: ${formattedFtnBalance} (converted from XLM)`);
      
      // Log the USD value for reference
      const usdValue = (numericBalance * 0.15).toFixed(2);
      console.log(`Equivalent USD value: $${usdValue}`);
      
      // Also fetch open claimable balances for this account
      try {
        const claimableBalances = await server.claimableBalances()
          .claimant(accountId)
          .call();
        
        if (claimableBalances.records && claimableBalances.records.length > 0) {
          console.log(`Found ${claimableBalances.records.length} claimable balances:`, claimableBalances.records);
        } else {
          console.log('No claimable balances found for this account');
        }
        // In a full implementation, we would track these and offer them to the user
      } catch (claimableErr) {
        console.log('No claimable balances found or error:', claimableErr);
      }
      
      return formattedBalance;
    } catch (err) {
      console.error('Error fetching balance:', err);
      // For new accounts, an error here is normal
      setBalance('0.0000000');
      setFtnBalance('0.0000000');
      return '0.0000000';
    }
  }, [server]);
  
  /**
   * Refresh the account balance
   */
  const refreshBalance = useCallback(async () => {
    if (!wallet?.publicKey) {
      return null;
    }
    
    try {
      const balance = await fetchBalance(wallet.publicKey);
      // Directly set the balance here to ensure it's updated
      setBalance(balance);
      return balance;
    } catch (err) {
      console.error('Error refreshing balance:', err);
      toast.error('Failed to refresh balance');
      throw err;
    }
  }, [wallet?.publicKey, fetchBalance]);
  
  /**
   * Export the wallet's mnemonic phrase
   * In a real app, this would be generated from the seed and properly secured
   */
  const exportMnemonic = useCallback(async () => {
    if (!secretKey) {
      toast.error('Wallet not loaded or missing secret key');
      return null;
    }
    
    try {
      // For demo purposes, we'll just return the secret key
      // In a real app, you'd convert to a 12/24 word mnemonic using BIP39
      return secretKey;
    } catch (err) {
      console.error('Error exporting mnemonic:', err);
      toast.error('Failed to export recovery phrase');
      throw err;
    }
  }, [secretKey]);
  
  /**
   * Send a payment to another Stellar account
   */
  const sendPayment = useCallback(async (destination: string, amount: string, memo?: string) => {
    if (!wallet?.publicKey || !secretKey) {
      toast.error('Wallet not loaded or missing secret key');
      return;
    }
    
    try {
      setIsLoading(true);
      setLoadingStatus('Preparing transaction...');
      
      // When user sends $5, we need to convert that to XLM amount
      // Always treat the input amount as USD
      let paymentAmount = amount.startsWith('$') 
        ? amount.substring(1) 
        : amount;
      
      // Convert USD to XLM (1 XLM = $0.15 USD)
      const usdAmount = parseFloat(paymentAmount);
      if (isNaN(usdAmount) || usdAmount <= 0) {
        throw new Error(`Invalid amount: ${amount}`);
      }
      
      // Calculate XLM amount by dividing USD by exchange rate
      const xlmAmount = (usdAmount / 0.15).toFixed(7);
      console.log(`Converting $${usdAmount} USD to ${xlmAmount} XLM for payment`);
      paymentAmount = xlmAmount;
      
      // Load the account
      const account = await server.loadAccount(wallet.publicKey);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset: StellarSdk.Asset.native(),
            amount: paymentAmount,
          })
        );
      
      // Add memo if provided
      if (memo) {
        transaction.addMemo(StellarSdk.Memo.text(memo));
      }
      
      // Finalize transaction
      const builtTx = transaction.setTimeout(30).build();
      
      // Sign the transaction
      setLoadingStatus('Signing transaction...');
      const sourceKeypair = Keypair.fromSecret(secretKey);
      builtTx.sign(sourceKeypair);
      
      // Submit the transaction
      setLoadingStatus('Submitting transaction...');
      const result = await server.submitTransaction(builtTx);
      
      // Store transaction details for demo purposes
      try {
        // This will help keep track of sent amounts for the demo
        const storedTransactionsStr = localStorage.getItem('bridgebotpay_transactions') || '[]';
        const storedTransactions = JSON.parse(storedTransactionsStr);
        
        // Format amounts consistently
        const usdAmount = parseFloat(amount.startsWith('$') ? amount.substring(1) : amount);
        const formattedUsdAmount = `$${usdAmount.toFixed(2)}`;
        
        // Create a unique transaction ID with timestamp
        const txId = 'tx-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
        
        // Add this transaction to the list
        const transactionRecord = {
          id: txId,
          amount: formattedUsdAmount,
          recipient: destination,
          date: new Date().toISOString(),
          usdAmount: usdAmount,
          xlmAmount: paymentAmount,
          memo: memo || '',
          type: 'payment'
        };
        
        storedTransactions.push(transactionRecord);
        
        // Save back to localStorage
        localStorage.setItem('bridgebotpay_transactions', JSON.stringify(storedTransactions));
        console.log('Stored transaction details for demo continuity:', transactionRecord);
      } catch (storageErr) {
        console.warn('Could not store transaction details:', storageErr);
      }
      
      // Refresh balance after successful transaction
      try {
        await refreshBalance();
        // Balance is already set in refreshBalance(), no need to set it again
        console.log("Balance refreshed after transaction");
      } catch (refreshError) {
        console.error("Failed to refresh balance after transaction:", refreshError);
      }
      
      return result;
    } catch (err) {
      console.error('Payment error:', err);
      toast.error('Payment failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [wallet, secretKey, server, refreshBalance]);
  
  /**
   * Create a claimable balance for someone to claim later
   */
  const createClaimableBalance = useCallback(async (
    amount: string, 
    claimant: string,
    pin: string,
    expirationDays: number = 7
  ) => {
    if (!wallet?.publicKey || !secretKey) {
      toast.error('Wallet not loaded or missing secret key');
      return;
    }
    
    try {
      setIsLoading(true);
      setLoadingStatus('Preparing claimable balance...');
      
      // Parse the amount (handle both "$20" and "20" formats)
      // Always treat the input amount as USD
      let paymentAmount = amount;
      if (amount.startsWith('$')) {
        paymentAmount = amount.substring(1);
      }
      
      // Convert USD to XLM (1 XLM = $0.15 USD)
      const usdAmount = parseFloat(paymentAmount);
      if (isNaN(usdAmount) || usdAmount <= 0) {
        throw new Error(`Invalid amount: ${amount}`);
      }
      
      // Calculate XLM amount by dividing USD by exchange rate
      const xlmAmount = (usdAmount / 0.15).toFixed(7);
      console.log(`Converting $${usdAmount} USD to ${xlmAmount} XLM for claimable balance`);
      paymentAmount = xlmAmount.replace(/\.?0+$/, '');
      
      // Set up the claim predicate
      // This is a time-bound predicate that expires after the specified days
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);
      
      const predicate = StellarSdk.Claimant.predicateBeforeAbsoluteTime(
        expirationDate.toISOString()
      );
      
      // Create claimant
      // In a real app, you might want to set this to any address since we'll use a PIN
      // But for demo purposes, we'll use a specific address
      const claimants = [new StellarSdk.Claimant(claimant, predicate)];
      
      console.log('Creating claimable balance with amount:', paymentAmount, 'for claimant:', claimant);
      
      // Load the account
      const account = await server.loadAccount(wallet.publicKey);
      
      // Build the transaction
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(
          StellarSdk.Operation.createClaimableBalance({
            asset: StellarSdk.Asset.native(),
            amount: paymentAmount,
            claimants,
          })
        )
        // Add memo with PIN 
        // In a real app, you would encrypt this or store it securely elsewhere
        .addMemo(StellarSdk.Memo.text(`PIN:${pin}`))
        .setTimeout(30)
        .build();
      
      // Sign the transaction
      setLoadingStatus('Signing transaction...');
      const sourceKeypair = Keypair.fromSecret(secretKey);
      transaction.sign(sourceKeypair);
      
      // Submit the transaction
      setLoadingStatus('Submitting transaction...');
      const result = await server.submitTransaction(transaction);
      console.log('Transaction submitted successfully:', result);
      
      // Extract the claimable balance ID from the operation
      setLoadingStatus('Retrieving claimable balance ID...');
      const operationResponse = await server
        .operations()
        .forTransaction(result.hash)
        .call();
      
      const balanceId = operationResponse.records.find(
        (op: any) => op.type === 'create_claimable_balance'
      )?.id;
      
      console.log('Created claimable balance with ID:', balanceId);
      
      // Store transaction details for demo purposes
      try {
        // This helps track of sent amounts for the claim flow
        const storedTransactionsStr = localStorage.getItem('bridgebotpay_transactions') || '[]';
        const storedTransactions = JSON.parse(storedTransactionsStr);
        
        // Extract the original USD amount from the input
        const originalUsdAmount = parseFloat(amount.startsWith('$') ? amount.substring(1) : amount);
        const formattedUsdAmount = `$${originalUsdAmount.toFixed(2)}`;
        
        // Create a transaction ID that will be easier to match during claim
        const txId = balanceId || ('cb-' + Date.now() + '-' + pin);
        
        // Add this claimable balance to the list
        const claimableBalanceRecord = {
          id: txId,
          balanceId: balanceId,
          amount: formattedUsdAmount,
          recipient: claimant,
          date: new Date().toISOString(),
          pin: pin,
          usdAmount: originalUsdAmount,
          xlmAmount: paymentAmount,
          type: 'claimable_balance'
        };
        
        storedTransactions.push(claimableBalanceRecord);
        
        // Save back to localStorage
        localStorage.setItem('bridgebotpay_transactions', JSON.stringify(storedTransactions));
        console.log('Stored claimable balance details:', claimableBalanceRecord);
      } catch (storageErr) {
        console.warn('Could not store claimable balance details:', storageErr);
      }
      
      // Refresh balance after successful transaction
      try {
        await refreshBalance();
        // Balance is already set in refreshBalance(), no need to set it again
        console.log("Balance refreshed after transaction");
      } catch (refreshError) {
        console.error("Failed to refresh balance after transaction:", refreshError);
      }
      
      // Prepare result
      // Store the original USD amount
      const origUsdAmount = parseFloat(paymentAmount) * 0.15;
      
      const claimableBalanceResult = {
        txHash: result.hash,
        balanceId,
        amount: paymentAmount, // XLM amount
        usdAmount: origUsdAmount.toFixed(2), // Store USD amount for proper display
        pin,
        recipient: claimant,
        expirationDate: expirationDate.toISOString(),
      };
      
      return claimableBalanceResult;
    } catch (err) {
      console.error('Create claimable balance error:', err);
      toast.error('Failed to create claimable balance');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [wallet, secretKey, server, refreshBalance]);
  
  /**
   * Claim a claimable balance
   */
  const claimBalance = useCallback(async (balanceId: string, pin: string) => {
    // For the demo, we'll create a mock implementation that always succeeds
    console.log('Mock claiming balance with ID:', balanceId, 'and PIN:', pin);
    
    try {
      setIsLoading(true);
      setLoadingStatus('Verifying claimable balance...');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would fetch the balance and verify the PIN
      // For demo purposes, let's just simulate success
      
      setLoadingStatus('Preparing claim transaction...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoadingStatus('Signing transaction...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoadingStatus('Claiming funds...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Mock transaction submitted successfully');
      
      // For demo purposes, use fixed amount instead of random
      // Extract the claim ID parts to get the amount info
      // Simulate retrieving the original sent amount
      
      // In a real implementation, we would look up the actual amount from the blockchain
      // For this mock, we'll extract from the balanceId or use a default
      
      // Extract values from localStorage for continuity
      const storedTransactionsStr = localStorage.getItem('bridgebotpay_transactions');
      let claimedUsdAmount = '0.00'; // Default to zero if no matching transaction found
      let originalCurrency = 'USD'; // Default currency
      
      // Store debug info for all transactions to help diagnose the issue
      console.log('Attempting to find transaction matching claimId:', balanceId);
      
      if (storedTransactionsStr) {
        const storedTransactions = JSON.parse(storedTransactionsStr);
        console.log('All stored transactions:', storedTransactions);
        
        // Try multiple matching strategies to find the correct transaction
        // First, try exact match by ID
        let matchingTx = storedTransactions.find((tx: any) => 
          tx.id === balanceId || tx.balanceId === balanceId
        );
        
        // If not found, try substring match
        if (!matchingTx) {
          matchingTx = storedTransactions.find((tx: any) => 
            (tx.id && balanceId.includes(tx.id)) || 
            (tx.balanceId && balanceId.includes(tx.balanceId)) ||
            (tx.id && tx.id.includes(balanceId)) ||
            (tx.balanceId && tx.balanceId.includes(balanceId))
          );
        }
        
        // If still not found, use the most recent transaction with PIN
        if (!matchingTx && pin) {
          matchingTx = storedTransactions
            .filter((tx: any) => tx.pin === pin)
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        }
        
        if (matchingTx && matchingTx.amount) {
          // Use the actual sent amount
          claimedUsdAmount = matchingTx.amount.toString().replace('$', '');
          // Store the original transaction for debugging
          console.log('Found matching transaction:', matchingTx);
          originalCurrency = matchingTx.amount.toString().startsWith('$') ? 'USD' : 'XLM';
        } else {
          console.warn('No matching transaction found for claimId:', balanceId);
        }
      }
      
      // Calculate the XLM equivalent of the USD amount
      const xlmAmount = (parseFloat(claimedUsdAmount) / 0.15).toFixed(7);
      
      // Refresh balance after successful transaction
      // In real app, we would actually update the balance with the claimed amount
      try {
        await refreshBalance();
      } catch (refreshErr) {
        console.warn('Could not refresh balance:', refreshErr);
      }
      
      toast.success(`Successfully claimed $${claimedUsdAmount} USD!`);
      
      return {
        txHash: 'mock-tx-' + Date.now(),
        balanceId,
        amount: claimedUsdAmount, // USD amount
        xlmAmount: xlmAmount, // XLM equivalent
        assetType: 'native',
        claimDate: new Date().toISOString()
      };
    } catch (err) {
      console.error('Claim balance error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to claim balance');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshBalance]);
  
  // Auto-refresh balance on component mount
  useEffect(() => {
    // If we have a wallet, make sure to refresh the balance
    if (wallet?.publicKey && !isLoading && balance === null) {
      console.log("Auto-refreshing balance...");
      refreshBalance().catch(err => {
        console.error("Error auto-refreshing balance:", err);
      });
    }
  }, [wallet?.publicKey, isLoading, balance, refreshBalance]);

  // Return the hook interface
  return {
    wallet,
    balance,
    ftnBalance,
    isLoading,
    loadingStatus,
    error,
    createWallet,
    refreshBalance,
    sendPayment,
    createClaimableBalance,
    claimBalance,
    exportMnemonic,
  };
};

export default useWallet;