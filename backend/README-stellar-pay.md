# Stellar Pay Client Integration

This document explains how to use the Stellar Pay client to interact with the Soroban smart contract deployed on Stellar Testnet.

## Environment Variables

Add the following environment variables to your `.env` file:

```
# Stellar Network Configuration
STELLAR_HORIZON_URL=https://soroban-testnet.stellar.org
STELLAR_NETWORK_PASSPHRASE=Test SDF Network ; September 2021
STELLAR_SOURCE_SECRET=YOUR_SECRET_KEY_HERE
STELLAR_PAY_CONTRACT_ID=CBCO2BHCAAZZ2DCVJ4CZ4G6T3WHTRFZNP3RYAQAI6CRDF6BBMO3UZKFG
STELLAR_NATIVE_ASSET_ID=NATIVE_ASSET_ID_HERE
```

## Usage Examples

### Direct Client Usage

```typescript
import { 
  createEscrow, 
  getEscrow, 
  claimEscrow, 
  refundEscrow 
} from './services/stellarPayClient';

// Create a new escrow payment
async function createNewEscrow() {
  try {
    const paymentId = 'payment_' + Date.now();
    const pinHashHex = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // SHA-256 hash of the PIN
    const amount = 100; // Amount in smallest units (stroops for XLM)
    const expiryUnix = Math.floor(Date.now() / 1000) + 86400; // Expires in 24 hours
    
    const result = await createEscrow(paymentId, undefined, pinHashHex, amount, expiryUnix);
    console.log('Escrow created:', result);
    return paymentId;
  } catch (error) {
    console.error('Error creating escrow:', error);
  }
}

// Get escrow details
async function checkEscrow(paymentId) {
  try {
    const escrow = await getEscrow(paymentId);
    console.log('Escrow details:', escrow);
    return escrow;
  } catch (error) {
    console.error('Error getting escrow:', error);
  }
}

// Claim an escrow payment
async function claimPayment(paymentId, pinPreimageHex) {
  try {
    const result = await claimEscrow(paymentId, pinPreimageHex);
    console.log('Escrow claimed:', result);
    return result;
  } catch (error) {
    console.error('Error claiming escrow:', error);
  }
}

// Refund an escrow payment
async function refundPayment(paymentId) {
  try {
    const result = await refundEscrow(paymentId);
    console.log('Escrow refunded:', result);
    return result;
  } catch (error) {
    console.error('Error refunding escrow:', error);
  }
}
```

### API Integration

To integrate the Stellar Pay API routes into your Express.js application:

1. Import the routes in your main Express app file:

```typescript
import express from 'express';
import stellarPayRoutes from './routes/stellarPayRoutes';

const app = express();
app.use(express.json());

// Add the Stellar Pay routes
app.use('/api/stellar-pay', stellarPayRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

2. API Endpoints:

- **Create Escrow**: `POST /api/stellar-pay/escrow`
  ```json
  {
    "paymentId": "unique_payment_id",
    "assetId": "optional_asset_id",
    "pinHashHex": "sha256_hash_of_pin_in_hex",
    "amount": 100,
    "expiryUnix": 1740000000
  }
  ```

- **Get Escrow**: `GET /api/stellar-pay/escrow/:paymentId`

- **Claim Escrow**: `POST /api/stellar-pay/escrow/:paymentId/claim`
  ```json
  {
    "pinPreimageHex": "pin_preimage_in_hex"
  }
  ```

- **Refund Escrow**: `POST /api/stellar-pay/escrow/:paymentId/refund`

## Error Handling

The client and API handle various error cases:

- Invalid PIN
- Escrow already claimed
- Escrow not found
- Escrow not expired (for refunds)
- Only sender can refund
- Network errors

Each error is properly caught and returned with an appropriate HTTP status code and message.

## Testing

You can test the integration using tools like Postman or curl:

```bash
# Create an escrow
curl -X POST http://localhost:3000/api/stellar-pay/escrow \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "test_payment_123",
    "pinHashHex": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "amount": 100,
    "expiryUnix": 1740000000
  }'

# Get escrow details
curl -X GET http://localhost:3000/api/stellar-pay/escrow/test_payment_123

# Claim escrow
curl -X POST http://localhost:3000/api/stellar-pay/escrow/test_payment_123/claim \
  -H "Content-Type: application/json" \
  -d '{
    "pinPreimageHex": "0000000000000000000000000000000000000000000000000000000000000000"
  }'

# Refund escrow
curl -X POST http://localhost:3000/api/stellar-pay/escrow/test_payment_123/refund
```

## Dependencies

Make sure to install the required dependencies:

```bash
npm install @stellar/soroban-client express
```
