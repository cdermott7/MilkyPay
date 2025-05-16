/**
 * SMS Service for sending claim links via text messages
 * 
 * This service integrates with our backend API which uses Twilio
 * to send SMS messages with claim links to recipients.
 */

// API URLs (using environment variables if available)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const CLAIM_LINK_ENDPOINT = `${API_BASE_URL}/sms/claim-link`;
const STATUS_UPDATE_ENDPOINT = `${API_BASE_URL}/sms/status-update`;
const VERIFY_PHONE_ENDPOINT = `${API_BASE_URL}/sms/verify-phone`;

/**
 * Send an SMS message with a claim link
 * @param phoneNumber The recipient's phone number
 * @param amount The amount being sent
 * @param pin The PIN needed to claim the funds
 * @param claimId The ID of the claimable balance
 * @param senderName Optional name of the sender
 */
export const sendClaimLinkSMS = async (
  phoneNumber: string,
  amount: string,
  pin: string,
  claimId: string,
  senderName?: string
): Promise<{success: boolean; error?: string}> => {
  try {
    // Call our backend API to send the SMS
    const response = await fetch(CLAIM_LINK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        amount,
        pin,
        claimId,
        senderName,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to send SMS notification');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send claim link SMS:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error sending SMS'
    };
  }
};

/**
 * Send a status update SMS
 * @param phoneNumber The recipient's phone number
 * @param status The status of the transaction
 * @param amount The amount involved
 * @param type The type of transaction
 */
export const sendStatusSMS = async (
  phoneNumber: string,
  status: 'success' | 'pending' | 'failed',
  amount: string,
  type: 'claim' | 'payment'
): Promise<{success: boolean; error?: string}> => {
  try {
    // Call our backend API to send the SMS
    const response = await fetch(STATUS_UPDATE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        status,
        amount,
        type,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to send status SMS');
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send status SMS:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error sending status update'
    };
  }
};

/**
 * Validate a phone number via API
 * @param phoneNumber The phone number to validate
 */
export const verifyPhoneNumber = async (
  phoneNumber: string
): Promise<{success: boolean; isValid?: boolean; formattedNumber?: string; error?: string}> => {
  try {
    // Call our backend API to verify the phone number
    const response = await fetch(VERIFY_PHONE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to verify phone number');
    }
    
    return { 
      success: true,
      isValid: data.data.isValid,
      formattedNumber: data.data.formattedNumber
    };
  } catch (error: any) {
    console.error('Failed to verify phone number:', error);
    return { 
      success: false, 
      error: error.message || 'Unknown error verifying phone number'
    };
  }
};

/**
 * Client-side phone number validation
 * This is used for immediate feedback before calling the API
 * @param phoneNumber The phone number to validate
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters except + for validation
  const cleaned = phoneNumber.replace(/[^0-9+]/g, '');
  
  // Check for valid formats (simple validation)
  if (cleaned.startsWith('+')) {
    // International format (should be at least 10 digits plus +)
    return cleaned.length >= 11;
  } else {
    // National format (should be at least 10 digits)
    return cleaned.length >= 10;
  }
};

export default {
  sendClaimLinkSMS,
  sendStatusSMS,
  verifyPhoneNumber,
  validatePhoneNumber,
};