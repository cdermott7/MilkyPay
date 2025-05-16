import { useState, useCallback } from 'react';

// Result interface
interface NLUResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
  response: string;
}

/**
 * Hook for Natural Language Understanding
 * This is a simplified version for the hackathon
 */
export const useNLU = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  /**
   * Process a command using basic NLU
   */
  const processCommand = useCallback(async (text: string): Promise<NLUResult> => {
    setIsProcessing(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Normalize input
      const normalizedText = text.toLowerCase().trim().replace(/\s+/g, ' ');
      console.log('Processing:', normalizedText);
      
      // Default result with fallback intent
      let result: NLUResult = {
        intent: 'unknown',
        confidence: 0.5,
        entities: {},
        response: "I'm not sure what you mean. Try saying 'Send $20 to +1-905-805-2755' or 'What's my balance?'"
      };
      
      // Phone number pattern (highest priority)
      // This will match formats like +1-905-805-2755
      if (/send|pay|transfer/.test(normalizedText)) {
        // Extract the amount (improved to handle decimals)
        const amountMatch = normalizedText.match(/\$?(\d+(?:\.\d+)?)/);
        const amount = amountMatch ? amountMatch[1] : "20";
        
        // Extract the phone number with improved regex
        // First pattern specifically for format like +1-905-805-2755
        const phonePattern1 = /\+\d{1,3}-\d{3}-\d{3}-\d{4}/g;
        // Second pattern for other common formats
        const phonePattern2 = /(?:\+\d{1,3})?[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/g;
        // Third pattern for broader matching of numbers with dashes
        const phonePattern3 = /\+\d{1,3}[\d\-\s()]{10,16}/g;
        
        // Find all possible matches
        const matches1 = normalizedText.match(phonePattern1) || [];
        const matches2 = normalizedText.match(phonePattern2) || [];
        const matches3 = normalizedText.match(phonePattern3) || [];
        
        console.log("phonePattern1 matches:", matches1);
        console.log("phonePattern2 matches:", matches2);
        console.log("phonePattern3 matches:", matches3);
        
        // Combine all matches and take the longest one (most complete phone number)
        const allMatches = [...matches1, ...matches2, ...matches3];
        let phone = allMatches.length > 0 
          ? allMatches.reduce((prev, current) => (current.length > prev.length) ? current : prev, "") 
          : "";
        
        console.log("All phone matches:", allMatches);
        console.log("Selected phone number:", phone);
        
        // Strip all non-digit characters except the leading + for the actual phone number format
        // This ensures hyphenated numbers like +1-905-805-2755 become +19058052755 for the SMS
        if (phone.startsWith('+')) {
          const stripped = '+' + phone.substring(1).replace(/\D/g, '');
          console.log(`Formatting phone number from "${phone}" to "${stripped}"`);
          phone = stripped;
        } else if (phone) {
          // If no + prefix, just strip all non-digits
          const stripped = phone.replace(/\D/g, '');
          console.log(`Formatting phone number from "${phone}" to "${stripped}"`);
          phone = stripped;
        }
        
        if (phone) {
          // Memos are handled in the transfer screen, not in the chat
          return {
            intent: 'send_money',
            confidence: 0.95,
            entities: {
              amount: `$${amount}`,
              recipient: phone
            },
            response: `I'll help you send $${amount} to ${phone}.`
          };
        }
      }
      
      // Balance check
      if (/balance|how much|money|have|account/.test(normalizedText)) {
        return {
          intent: 'check_balance',
          confidence: 0.9,
          entities: {},
          response: `Your current balance is available in your wallet.`
        };
      }
      
      // Help intent
      if (/help|assist|what can you do/.test(normalizedText)) {
        return {
          intent: 'help',
          confidence: 0.9,
          entities: {},
          response: `I can help you send money, check your balance, and more. Try typing "Send $20 to +1-905-805-2755" or "What's my balance?"`
        };
      }
      
      return result;
    } finally {
      setIsProcessing(false);
    }
  }, []);
  
  return {
    processCommand,
    isProcessing,
  };
};

export default useNLU;