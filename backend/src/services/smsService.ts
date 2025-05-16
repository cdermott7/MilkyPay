import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client if credentials are available
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

/**
 * Format a phone number to E.164 format
 * @param phoneNumber Phone number to format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters except the + prefix
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    // If it's a US number without country code, add +1
    if (cleaned.length === 10) {
      cleaned = `+1${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }
  
  return cleaned;
};

/**
 * Validate a phone number
 * @param phoneNumber The phone number to validate
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters except + for validation
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Simple validation: should start with + and be at least 10 digits
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 11; // + and at least 10 digits
  } else {
    return cleaned.length >= 10; // at least 10 digits
  }
};

/**
 * Generate a claim link
 */
const generateClaimLink = (claimId: string): string => {
  // Get the app URL from environment variables
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  
  // In a real-world app, you might use a URL shortener here
  return `${appUrl}/claim/${claimId}`;
};

/**
 * Send an SMS message
 * @param to Recipient phone number
 * @param body Message body
 */
export const sendSMS = async (to: string, body: string): Promise<{success: boolean; sid?: string; error?: string}> => {
  try {
    // Check if Twilio is configured
    if (!twilioClient || !fromNumber) {
      console.log('Twilio not configured, mock sending SMS to:', to, 'Body:', body);
      // Return mock success for development
      return { 
        success: true, 
        sid: `MOCK_${Date.now()}` 
      };
    }
    
    // Format the phone number
    const formattedPhone = formatPhoneNumber(to);
    
    // Send the SMS
    const message = await twilioClient.messages.create({
      body,
      from: fromNumber,
      to: formattedPhone
    });
    
    console.log('SMS sent successfully, SID:', message.sid);
    
    return {
      success: true,
      sid: message.sid
    };
  } catch (error: any) {
    console.error('Failed to send SMS:', error);
    return {
      success: false,
      error: error.message || 'Unknown error sending SMS'
    };
  }
};

/**
 * Send a claim link via SMS
 * @param phoneNumber Recipient's phone number
 * @param amount Amount sent
 * @param pin PIN for claiming
 * @param claimId Claimable balance ID
 * @param senderName Sender's name (optional)
 */
export const sendClaimLinkSMS = async (
  phoneNumber: string,
  amount: string,
  pin: string,
  claimId: string,
  senderName?: string
): Promise<{success: boolean; sid?: string; error?: string}> => {
  try {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }
    
    // Generate claim link
    const claimLink = generateClaimLink(claimId);
    
    // Format the amount for display (ensure it has $ if not already)
    const formattedAmount = amount.startsWith('$') ? amount : `$${amount}`;
    
    // Create the message
    let message: string;
    if (senderName) {
      message = `${senderName} sent you ${formattedAmount} via MilkyPay! Use PIN: ${pin} to claim your funds at ${claimLink}`;
    } else {
      message = `You received ${formattedAmount} via MilkyPay! Use PIN: ${pin} to claim your funds at ${claimLink}`;
    }
    
    // Send the SMS
    return await sendSMS(phoneNumber, message);
  } catch (error: any) {
    console.error('Failed to send claim link SMS:', error);
    return {
      success: false,
      error: error.message || 'Unknown error sending claim link SMS'
    };
  }
};

/**
 * Send a status update SMS for a claim or payment
 * @param phoneNumber Recipient's phone number
 * @param status Status of the transaction (success, pending, failed)
 * @param amount Amount involved
 * @param type Type of transaction (claim, payment)
 */
export const sendStatusSMS = async (
  phoneNumber: string,
  status: 'success' | 'pending' | 'failed',
  amount: string,
  type: 'claim' | 'payment'
): Promise<{success: boolean; sid?: string; error?: string}> => {
  try {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }
    
    // Format the amount for display
    const formattedAmount = amount.startsWith('$') ? amount : `$${amount}`;
    
    // Create the message based on status and type
    let message: string;
    
    if (type === 'claim') {
      if (status === 'success') {
        message = `Success! Your claim of ${formattedAmount} has been processed and added to your MilkyPay wallet.`;
      } else if (status === 'pending') {
        message = `Your claim of ${formattedAmount} is being processed. You'll receive confirmation shortly.`;
      } else {
        message = `Your claim of ${formattedAmount} could not be processed. Please try again or contact support.`;
      }
    } else { // payment
      if (status === 'success') {
        message = `Your payment of ${formattedAmount} has been successfully processed.`;
      } else if (status === 'pending') {
        message = `Your payment of ${formattedAmount} is being processed. You'll receive confirmation shortly.`;
      } else {
        message = `Your payment of ${formattedAmount} could not be processed. Please try again or contact support.`;
      }
    }
    
    // Send the SMS
    return await sendSMS(phoneNumber, message);
  } catch (error: any) {
    console.error('Failed to send status SMS:', error);
    return {
      success: false,
      error: error.message || 'Unknown error sending status SMS'
    };
  }
};

export default {
  sendSMS,
  sendClaimLinkSMS,
  sendStatusSMS,
  validatePhoneNumber,
  formatPhoneNumber,
};