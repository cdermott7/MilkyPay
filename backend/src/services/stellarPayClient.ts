/**
 * Stellar Pay Client
 * 
 * A TypeScript client for interacting with the Stellar Pay smart contract on Stellar Testnet.
 * This module provides functions to create, get, claim, and refund escrow payments using
 * the deployed Soroban contract with the ID specified in the environment variables.
 */

import { 
  Server,
  TransactionBuilder, 
  Networks, 
  Keypair, 
  Operation,
  Asset,
  BASE_FEE,
  TimeoutInfinite
} from 'stellar-sdk';

// Environment variables with defaults for Testnet
const STELLAR_HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK_PASSPHRASE || Networks.TESTNET;
const SOURCE_SECRET = process.env.STELLAR_SOURCE_SECRET;
const VOUCHER_ACCOUNT_ID = process.env.VOUCHER_CONTRACT_ID || 'GBCO2BHCAAZZ2DCVJ4CZ4G6T3WHTRFZNP3RYAQAI6CRDF6BBMO3UZKFG';

// Validate required environment variables
if (!SOURCE_SECRET) {
  throw new Error('STELLAR_SOURCE_SECRET environment variable is required');
}

// Initialize Horizon server client
const server = new Server(STELLAR_HORIZON_URL);

// Load source account from secret key
const sourceKeypair = Keypair.fromSecret(SOURCE_SECRET);
console.log(`Using source account: ${sourceKeypair.publicKey()}`);

/**
 * Helper function to prepare and submit a transaction
 * @param {Array} operations - Array of operations
 * @returns {Promise<any>} - Transaction result
 */
async function submitTransaction(operations: any[]): Promise<any> {
  try {
    // Get the source account
    const account = await server.loadAccount(sourceKeypair.publicKey());
    
    // Build the transaction
    let txBuilder = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
      timebounds: { minTime: 0, maxTime: TimeoutInfinite }
    });
    
    // Add operations
    operations.forEach(op => {
      txBuilder = txBuilder.addOperation(op);
    });
    
    // Build and sign the transaction
    const transaction = txBuilder.build();
    transaction.sign(sourceKeypair);
    
    // Submit the transaction
    console.log('Submitting transaction...');
    const result = await server.submitTransaction(transaction);
    console.log(`Transaction successful with hash: ${result.hash}`);
    return result;
  } catch (error) {
    console.error('Transaction error:', error);
    if (error.response && error.response.data && error.response.data.extras) {
      console.error('Transaction failed with result codes:', 
        error.response.data.extras.result_codes);
    }
    throw error;
  }
}

/**
 * Creates an escrow payment (simplified version using regular Stellar transactions)
 * @param {string} recipientId - The payment recipient's Stellar ID or payment identifier
 * @param {number} amount - Amount to escrow (in XLM)
 * @param {number} expiryUnix - Unix timestamp for expiry (used for memo only)
 * @returns {Promise<any>} - Transaction result
 */
export async function createEscrow(
  recipientId: string, 
  amount: number, 
  expiryUnix: number = Math.floor(Date.now()/1000) + 86400 // Default: 24 hours
): Promise<any> {
  try {
    console.log(`Creating escrow payment for ${amount} XLM to be claimed by ${recipientId}`);
    
    const memoText = `Escrow-${expiryUnix}`;
    
    // Create a payment operation to the escrow account
    const operation = Operation.payment({
      destination: VOUCHER_ACCOUNT_ID,
      asset: Asset.native(), // XLM
      amount: amount.toString(),
    });
    
    return await submitTransaction([operation]);
  } catch (error) {
    console.error('Error creating escrow:', error);
    throw new Error(`Failed to create escrow: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets the transaction history for an account (can be used to track escrow payments)
 * @param {string} accountId - Account to check (defaults to source account)
 * @returns {Promise<any>} - Payment history
 */
export async function getAccountPaymentHistory(accountId: string = sourceKeypair.publicKey()): Promise<any> {
  try {
    console.log(`Getting payment history for account: ${accountId}`);
    
    const payments = await server.payments()
      .forAccount(accountId)
      .limit(20)
      .order('desc')
      .call();
    
    return payments.records;
  } catch (error) {
    console.error('Error getting account payment history:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get payment history: ${errorMsg}`);
  }
}

/**
 * Creates a payment (simplified version of claiming escrow using regular Stellar payment)
 * @param {string} destinationId - Stellar account ID to send payment to
 * @param {number} amount - Amount to send in XLM
 * @returns {Promise<any>} - Transaction result
 */
export async function sendPayment(
  destinationId: string, 
  amount: number
): Promise<any> {
  try {
    console.log(`Sending payment of ${amount} XLM to ${destinationId}`);
    
    // Create a payment operation
    const operation = Operation.payment({
      destination: destinationId,
      asset: Asset.native(), // XLM
      amount: amount.toString(),
    });
    
    return await submitTransaction([operation]);
  } catch (error) {
    console.error('Error sending payment:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('op_underfunded')) {
      throw new Error('Insufficient funds for this payment');
    } else if (errorMsg.includes('op_no_destination')) {
      throw new Error('Destination account does not exist');
    }
    throw new Error(`Failed to send payment: ${errorMsg}`);
  }
}

/**
 * Checks account information including balances
 * @param {string} accountId - Stellar account ID (defaults to source account)
 * @returns {Promise<any>} - Account information
 */
export async function getAccountInfo(accountId: string = sourceKeypair.publicKey()): Promise<any> {
  try {
    console.log(`Getting account info for: ${accountId}`);
    const account = await server.loadAccount(accountId);
    return account;
  } catch (error) {
    console.error('Error getting account info:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get account info: ${errorMsg}`);
  }
}

// Export all functions
export default {
  createEscrow,
  getAccountPaymentHistory,
  sendPayment,
  getAccountInfo
};
