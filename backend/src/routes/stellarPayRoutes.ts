/**
 * Stellar Pay API Routes
 * 
 * Express routes for interacting with the Stellar Pay smart contract.
 * These endpoints provide a RESTful interface to the contract's functionality.
 */

import express from 'express';
import { createEscrow, getEscrow, claimEscrow, refundEscrow } from '../services/stellarPayClient';

const router = express.Router();

/**
 * Create a new escrow payment
 * POST /api/stellar-pay/escrow
 * 
 * Request body:
 * {
 *   "paymentId": "unique_payment_id",
 *   "assetId": "optional_asset_id", // Defaults to native XLM if not provided
 *   "pinHashHex": "sha256_hash_of_pin_in_hex",
 *   "amount": 100, // Amount in smallest units (stroops for XLM)
 *   "expiryUnix": 1740000000 // Unix timestamp for expiry
 * }
 */
router.post('/escrow', async (req, res) => {
  try {
    const { paymentId, assetId, pinHashHex, amount, expiryUnix } = req.body;
    
    // Validate required fields
    if (!paymentId || !pinHashHex || !amount || !expiryUnix) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['paymentId', 'pinHashHex', 'amount', 'expiryUnix'] 
      });
    }
    
    // Create the escrow
    const result = await createEscrow(paymentId, assetId, pinHashHex, amount, expiryUnix);
    
    res.status(201).json({
      success: true,
      message: 'Escrow created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create escrow',
      error: error.message
    });
  }
});

/**
 * Get escrow details
 * GET /api/stellar-pay/escrow/:paymentId
 */
router.get('/escrow/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Get the escrow
    const escrow = await getEscrow(paymentId);
    
    if (!escrow) {
      return res.status(404).json({
        success: false,
        message: 'Escrow not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: escrow
    });
  } catch (error) {
    console.error('Error getting escrow:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get escrow',
      error: error.message
    });
  }
});

/**
 * Claim an escrow payment
 * POST /api/stellar-pay/escrow/:paymentId/claim
 * 
 * Request body:
 * {
 *   "pinPreimageHex": "pin_preimage_in_hex"
 * }
 */
router.post('/escrow/:paymentId/claim', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { pinPreimageHex } = req.body;
    
    // Validate required fields
    if (!pinPreimageHex) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['pinPreimageHex'] 
      });
    }
    
    // Claim the escrow
    const result = await claimEscrow(paymentId, pinPreimageHex);
    
    res.status(200).json({
      success: true,
      message: 'Escrow claimed successfully',
      data: result
    });
  } catch (error) {
    console.error('Error claiming escrow:', error);
    
    // Handle specific error cases
    if (error.message.includes('already claimed')) {
      return res.status(400).json({
        success: false,
        message: 'Escrow has already been claimed',
        error: error.message
      });
    } else if (error.message.includes('invalid PIN')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN provided',
        error: error.message
      });
    } else if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Escrow not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to claim escrow',
      error: error.message
    });
  }
});

/**
 * Refund an escrow payment
 * POST /api/stellar-pay/escrow/:paymentId/refund
 */
router.post('/escrow/:paymentId/refund', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Refund the escrow
    const result = await refundEscrow(paymentId);
    
    res.status(200).json({
      success: true,
      message: 'Escrow refunded successfully',
      data: result
    });
  } catch (error) {
    console.error('Error refunding escrow:', error);
    
    // Handle specific error cases
    if (error.message.includes('not expired')) {
      return res.status(400).json({
        success: false,
        message: 'Escrow has not expired yet',
        error: error.message
      });
    } else if (error.message.includes('already claimed')) {
      return res.status(400).json({
        success: false,
        message: 'Escrow has already been claimed',
        error: error.message
      });
    } else if (error.message.includes('not the sender')) {
      return res.status(403).json({
        success: false,
        message: 'Only the original sender can refund this escrow',
        error: error.message
      });
    } else if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        message: 'Escrow not found',
        error: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to refund escrow',
      error: error.message
    });
  }
});

export default router;
