/**
 * stellarOnchain.js
 * 
 * A Node.js helper library for interacting with a Soroban smart contract on Stellar Testnet.
 * This module provides functions to create, get, claim, and refund escrow payments using
 * a deployed Soroban contract with the alias 'stellar_pay'.
 */

const StellarSdk = require('stellar-sdk');

// Environment variables
const HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://rpc.testnet.soroban.stellar.org';
const NETWORK_PASSPHRASE = process.env.STELLAR_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2021';
const SOURCE_SECRET = process.env.STELLAR_SOURCE_SECRET;
const CONTRACT_ID = process.env.VOUCHER_CONTRACT_ID;

if (!SOURCE_SECRET) {
  throw new Error('STELLAR_SOURCE_SECRET environment variable is required');
}

if (!CONTRACT_ID) {
  throw new Error('VOUCHER_CONTRACT_ID environment variable is required');
}

// Initialize Stellar Server
const server = new StellarSdk.Server(HORIZON_URL, { allowHttp: HORIZON_URL.startsWith('http://') });

// Load source account from secret key
const sourceKeypair = StellarSdk.Keypair.fromSecret(SOURCE_SECRET);
console.log(`Using source account: ${sourceKeypair.publicKey()}`);

// Initialize contract (using Stellar SDK)
const contractId = CONTRACT_ID;

/**
 * Helper function to convert a hex string to a BytesN Soroban value
 * @param {string} hexString - Hex string without '0x' prefix
 * @param {number} length - Length of the BytesN (default: 32)
 * @returns {xdr.ScVal} - Soroban ScVal of type BytesN
 */
function hexToScBytes(hexString, length = 32) {
  if (hexString.startsWith('0x')) {
    hexString = hexString.slice(2);
  }
  
  // Ensure the hex string is the right length
  if (hexString.length !== length * 2) {
    throw new Error(`Hex string must be exactly ${length * 2} characters (${length} bytes)`);
  }
  
  const buffer = Buffer.from(hexString, 'hex');
  return buffer;
}

/**
 * Helper function to convert a string to a Symbol Soroban value
 * @param {string} str - String to convert
 * @returns {xdr.ScVal} - Soroban ScVal of type Symbol
 */
function stringToSymbol(str) {
  return str; // In stellar-sdk we use strings directly
}

/**
 * Helper function to convert a Stellar address to a Soroban Address value
 * @param {string} stellarAddress - Stellar address (G...)
 * @returns {Address} - Soroban Address
 */
function toSorobanAddress(stellarAddress) {
  return stellarAddress; // In stellar-sdk we use the address string directly
}

/**
 * Helper function to prepare and submit a transaction
 * @param {Array} operations - Array of Soroban operations
 * @param {boolean} isReadOnly - Whether this is a read-only simulation
 * @returns {Promise<any>} - Transaction result or simulation result
 */
async function submitTransaction(operations, isReadOnly = false) {
  try {
    // Load account
    const account = await server.loadAccount(sourceKeypair.publicKey());
    
    // Build the transaction
    let txBuilder = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: NETWORK_PASSPHRASE,
    });
    
    // Add operations
    operations.forEach(op => {
      txBuilder = txBuilder.addOperation(op);
    });
    
    // Build and sign the transaction
    const transaction = txBuilder.setTimeout(30).build();
    transaction.sign(sourceKeypair);
    
    if (isReadOnly) {
      // For read-only operations in Stellar SDK, we can still submit but just not broadcast
      console.log('Executing read-only operation...');
      // In stellar-sdk, we'd typically use a different approach for read operations
      // This is a simplified version
      const result = await server.submitTransaction(transaction);
      return result;
    } else {
      // For write operations, submit the transaction
      console.log('Submitting transaction...');
      const result = await server.submitTransaction(transaction);
      
      console.log(`Transaction hash: ${result.hash}`);
      console.log(`Transaction successful: ${result.successful}`);
      
      if (!result.successful) {
        throw new Error(`Transaction failed: ${JSON.stringify(result)}`);
      }
      
      return { 
        success: true, 
        hash: result.hash,
        result: result
      };
    }
  } catch (error) {
    console.error('Transaction error:', error);
    throw error;
  }
}

/**
 * Creates an escrow payment
 * @param {string} sender - Sender's Stellar address
 * @param {string} paymentId - Unique payment identifier
 * @param {string} assetId - Asset ID (use native asset ID for XLM)
 * @param {string} pinHashHex - SHA-256 hash of the PIN in hex format
 * @param {number} amount - Amount to escrow
 * @param {number} expiry - Unix timestamp for expiry
 * @returns {Promise<any>} - Transaction result
 */
async function createEscrow(sender, paymentId, assetId, pinHashHex, amount, expiry) {
  console.log(`Creating escrow: ${paymentId} for ${amount} of asset ${assetId}`);
  
  const operation = contract.call(
    "create_escrow",
    toSorobanAddress(sender),
    stringToSymbol(paymentId),
    stringToSymbol(assetId),
    hexToScBytes(pinHashHex),
    xdr.ScVal.scvU64(xdr.Uint64.fromString(amount.toString())),
    xdr.ScVal.scvU64(xdr.Uint64.fromString(expiry.toString()))
  );
  
  return submitTransaction([operation]);
}

/**
 * Gets the current state of an escrow payment
 * @param {string} paymentId - Unique payment identifier
 * @returns {Promise<any>} - Escrow state
 */
async function getEscrow(paymentId) {
  console.log(`Getting escrow: ${paymentId}`);
  
  const operation = contract.call(
    "get_escrow",
    stringToSymbol(paymentId)
  );
  
  return submitTransaction([operation], true);
}

/**
 * Claims an escrow payment
 * @param {string} claimant - Claimant's Stellar address
 * @param {string} paymentId - Unique payment identifier
 * @param {string} pinPreimageHex - Preimage of the PIN hash in hex format
 * @returns {Promise<any>} - Transaction result
 */
async function claimEscrow(claimant, paymentId, pinPreimageHex) {
  console.log(`Claiming escrow: ${paymentId} by ${claimant}`);
  
  const operation = contract.call(
    "claim_escrow",
    toSorobanAddress(claimant),
    stringToSymbol(paymentId),
    hexToScBytes(pinPreimageHex)
  );
  
  return submitTransaction([operation]);
}

/**
 * Refunds an escrow payment
 * @param {string} sender - Sender's Stellar address
 * @param {string} paymentId - Unique payment identifier
 * @returns {Promise<any>} - Transaction result
 */
async function refundEscrow(sender, paymentId) {
  console.log(`Refunding escrow: ${paymentId} to ${sender}`);
  
  const operation = contract.call(
    "refund_escrow",
    toSorobanAddress(sender),
    stringToSymbol(paymentId)
  );
  
  return submitTransaction([operation]);
}

module.exports = {
  createEscrow,
  getEscrow,
  claimEscrow,
  refundEscrow
};

// Example usage (uncomment to run)
/*
(async () => {
  try {
    const payment = await createEscrow(
      "G...USERPUBKEY...",
      "my_payment_1",
      "<nativeAssetId>",
      "e3b0c442...",
      100,
      1740000000
    );
    console.log("Escrow created:", payment);
    
    const state = await getEscrow("my_payment_1");
    console.log("Escrow state:", state);
  } catch (error) {
    console.error("Error in example:", error);
  }
})();
*/
