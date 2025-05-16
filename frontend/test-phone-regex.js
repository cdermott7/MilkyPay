// Test script for phone number parsing regex patterns

// These are the pattern definitions from our useNLU.new.ts
const phonePattern1 = /\+\d{1,3}-\d{3}-\d{3}-\d{4}/g;
const phonePattern2 = /(?:\+\d{1,3})?[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/g;
const phonePattern3 = /\+\d{1,3}[\d\-\s()]{10,16}/g;

// Test cases - these should all match
const testPhoneNumbers = [
  "+1-905-805-2755",  // The problematic format we're trying to fix
  "+1 905 805 2755",  // Spaces
  "+1(905)805-2755",  // Parentheses
  "+1 (905) 805-2755", // Mixed format
  "+44-123-456-7890",  // UK format
  "+86-123-4567-8901"  // China format
];

// Function to test each pattern on each phone number
function testPattern(pattern, phoneNumber) {
  const matches = phoneNumber.match(pattern);
  return matches ? matches[0] : null;
}

// Test and display results
console.log("Phone Number Regex Testing");
console.log("=========================");

testPhoneNumbers.forEach(phoneNumber => {
  console.log(`\nTesting: "${phoneNumber}"`);
  
  const match1 = testPattern(phonePattern1, phoneNumber);
  const match2 = testPattern(phonePattern2, phoneNumber);
  const match3 = testPattern(phonePattern3, phoneNumber);
  
  console.log(`Pattern 1 (exact hyphenated): ${match1 || "No match"}`);
  console.log(`Pattern 2 (standard format): ${match2 || "No match"}`);
  console.log(`Pattern 3 (broader format): ${match3 || "No match"}`);
  
  // Combined result - what would be used in our app
  const allMatches = [match1, match2, match3].filter(Boolean);
  const longestMatch = allMatches.length > 0 
    ? allMatches.reduce((prev, current) => (current.length > prev.length) ? current : prev, "")
    : "No matches";
    
  console.log(`Final result: ${longestMatch}`);
});

// Test integrated into a sentence - similar to actual NLU input
const testSentences = [
  "Send $50 to +1-905-805-2755 please",
  "I want to transfer $20 to +1 (905) 805-2755",
  "Please send money to +44-123-456-7890"
];

console.log("\n\nSentence Extraction Tests");
console.log("=======================");

testSentences.forEach(sentence => {
  console.log(`\nTesting sentence: "${sentence}"`);
  
  // Normalize input as in our NLU
  const normalizedText = sentence.toLowerCase().trim();
  
  // Extract using our patterns
  const matches1 = normalizedText.match(phonePattern1) || [];
  const matches2 = normalizedText.match(phonePattern2) || [];
  const matches3 = normalizedText.match(phonePattern3) || [];
  
  console.log(`Pattern 1 matches: ${JSON.stringify(matches1)}`);
  console.log(`Pattern 2 matches: ${JSON.stringify(matches2)}`);
  console.log(`Pattern 3 matches: ${JSON.stringify(matches3)}`);
  
  // Combine all matches and take the longest one (most complete phone number)
  const allMatches = [...matches1, ...matches2, ...matches3];
  const phone = allMatches.length > 0 
    ? allMatches.reduce((prev, current) => (current.length > prev.length) ? current : prev, "") 
    : "No matches";
    
  console.log(`Final extracted phone: ${phone}`);
});