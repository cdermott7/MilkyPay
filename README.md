<div align="center">
  <img src="./assets/images/StellarLogo.png" alt="MilkyPay Logo" width="400"/>
  <h1>MilkyPay: Voice-Enabled Cross-Border Remittance on Stellar Network</h1>
  <p><i>A self-custodial, voice-driven payment solution that enables frictionless global money transfers with a simple link + PIN approach</i></p>
</div>

<div align="center">
  <h4>Created by Cole Dermott and Tolga Cohce</h4>
  <p><b>Team:</b> MilkyPay • <b>Contact:</b> <a href="mailto:dermottcole@gmail.com">dermottcole@gmail.com</a></p>
</div>

## Overview

MilkyPay is a **voice-enabled**, **self‑custodial** Stellar remittance tool that mimics an e‑transfer. Users generate a wallet, load funds, and send money across borders via a simple **link + PIN** flow. A built‑in AI assistant handles voice commands for sending, claiming, off‑ramping, and refunds—all powered by Stellar's low‑fee network and local fiat anchors.

## Table of Contents

- [Demo Video](#demo-video)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Technical Architecture](#technical-architecture)
- [Repository Structure](#repository-structure)
- [MilkyPay in Action](#MilkyPay-in-action)
- [Stellar Integration](#stellar-integration)
- [Multi-Chain Support](#multi-chain-support)
- [Voice-First Approach](#voice-first-approach)
- [Getting Started](#getting-started)
- [Project Description](#project-description)
- [License](#license)

## Demo Video

[![MilkyPay Demo Video](https://img.youtube.com/vi/-HJDbgt1tEA/0.jpg)](https://www.youtube.com/watch?v=-HJDbgt1tEA&ab_channel=ColderGames9.5)

*Click the image above to watch the full demo of MilkyPay in action.*

> This comprehensive demo showcases how MilkyPay leverages Stellar's features for secure cross-border payments with voice commands, link sharing, and PIN authentication.

[![MilkyPay Presentation Video](https://img.youtube.com/vi/8jddUsZT8Dw/0.jpg)](https://youtu.be/8jddUsZT8Dw)

*Click the image above to watch us explore the potential of MilkyPay.*

> This comprehensive presentation explains how MilkyPay is the best possible payment solution one can achieve in Web3 for seamless UX.

[![MilkyPay Short Demo Video](https://img.youtube.com/vi/uFc6qQFs-qo/0.jpg)](https://youtu.be/uFc6qQFs-qo)

*Click the image above to watch a short demo video of MilkyPay's features.*

> This is a short demo showing off MilkyPay's main feature.

## Key Features

- **Self‑Custodial Wallets**: Client‑side key generation and secure seed storage (encrypted, mnemonic backup, optional SEP‑30 recovery)
- **Voice‑First UX**: Web Speech API + NLU for commands like "Send $10 to +1-905-805-2755" and spoken confirmations
- **Link + PIN Claim**: On‑chain Claimable Balances (or Soroban escrow contracts) for recipients—no wallet install needed
- **Fiat On/Off‑Ramps**: Integrated anchor APIs (Flutterwave, MoneyGram, etc.) abstracted under the voice/chat UI
- **Refund & History**: Full transaction history with voice queries ("What did I send yesterday?") and one‑tap refunds
- **Multi-Chain Support**: Primary support for Stellar XLM with expansion to FastToken (FTN) on Bahamut network

## Screenshots

### Home Screen – Dark Mode  
![MilkyPay Base Dark Mode](./assets/images/MilkyPayBaseDarkMode.png)  
*Dark-mode dashboard showing USD, XLM, and FTN balances with quick-action buttons for Deposit, Purchase, Transfer, and Withdraw.*

### Home Screen Variant – Dark Mode  
![MilkyPay Base Dark Mode 2](./assets/images/MilkyPayBaseDarkMode2.png)  
*Alternate dark-mode dashboard view highlighting expanded wallet details and recent transactions.*

### Home Screen – Light Mode  
![MilkyPay Base Light Mode](./assets/images/MilkyPayBaseLightmode.png)  
*Light-mode dashboard displaying USD, XLM, and FTN balances with the same quick-action buttons.*

### Claim Funds Interface  
![MilkyPay Claim Funds Screen](./assets/images/MilkyPayClaimFundsScreen.png)  
*Secure claim screen where recipients enter a PIN to verify and claim funds sent via link.*

### Deposit Flow – Light Mode  
![MilkyPay Deposit Light Mode](./assets/images/MilkyPayDepositLightMode.png)  
*Light-mode deposit interface prompting users to select an asset and enter the amount.*

### Deposit Confirmation – Light Mode  
![MilkyPay Deposit Light Mode 2](./assets/images/MilkyPayDepositLightMode2.png)  
*Light-mode deposit confirmation showing amount, network fees, and a Confirm button.*

### Loading Animation  
![MilkyPay Load Animation Screen](./assets/images/MilkyPayLoadAnimationScreen.png)  
*Animated loader displayed while transactions or data are being processed.*

### Off-Ramp Flow  
![MilkyPay Offramp Screen](./assets/images/MilkyPayOfframpScreen.png)  
*Interface for converting crypto to fiat, showing available rails and fees.*

### Profile – Dark Mode  
![MilkyPay Profile Dark Mode](./assets/images/MilkyPayProfileDarkMode.png)  
*Dark-mode profile screen with user info, theme toggle, and wallet backup options.*

### Profile – Light Mode  
![MilkyPay Profile Light Mode](./assets/images/MilkyPayProfileLightMode.png)  
*Light-mode profile interface displaying user settings and security features.*

### Purchase Flow – Dark Mode  
![MilkyPay Purchase Dark Mode](./assets/images/MilkyPayPurchaseDarkMode.png)  
*Dark-mode purchase screen allowing users to buy FTN or XLM with real-time rate quotes.*

### Purchase Flow – Light Mode  
![MilkyPay Purchase Light Mode](./assets/images/MilkyPayPurchaseLightMode.png)  
*Light-mode purchase interface with input fields for amount, currency selector, and order summary.*

### Recurring Payments – Dark Mode  
![MilkyPay Recurring Payment Dark Mode](./assets/images/MilkyPayRecurringPaymentDarkMode.png)  
*Dark-mode view for scheduling and managing recurring payments or subscriptions.*

### Recurring Payments – Light Mode  
![MilkyPay Recurring Payment Light Mode](./assets/images/MilkyPayRecurringPaymentLightMode.png)  
*Light-mode interface for setting up automated, recurring transfers.*

### SMS Notification Example  
![MilkyPay SMS Example](./assets/images/MilkyPaySMSExample.png)  
*Illustration of an SMS notification sent to a recipient with a secure claim link.*

### Settings – Dark Mode  
![MilkyPay Settings Dark Mode](./assets/images/MilkyPaySettingsDarkMode.png)  
*Dark-mode settings screen with privacy, security, and notification preferences.*

### Settings – Light Mode  
![MilkyPay Settings Light Mode](./assets/images/MilkyPaySettingsLightMode.png)  
*Light-mode settings interface showing configurable options and toggles.*

### Transaction Animation  
![MilkyPay Transaction Animation](./assets/images/MilkyPayTransactionAnimation.png)  
*Visual feedback animation displayed when a transaction is successfully sent.*

### Transaction History – Dark Mode  
![MilkyPay Transaction History Dark Mode](./assets/images/MilkyPayTransactionHistoryDarkMode.png)  
*Dark-mode history view listing past payments, claims, and memos with timestamps.*

### Transaction History – Light Mode  
![MilkyPay Transaction History Light Mode](./assets/images/MilkyPayTransactionHistoryLightMode.png)  
*Light-mode transaction log showing detailed history of all account activity.*

### Transfer Flow – Dark Mode  
![MilkyPay Transfer Dark Mode](./assets/images/MilkyPayTransferDarkMode.png)  
*Dark-mode send-money flow with recipient entry, amount input, and optional memo.*

### Transfer Flow – Light Mode  
![MilkyPay Transfer Light Mode](./assets/images/MilkyPayTransferLightMode.png)  
*Light-mode transfer interface featuring contact picker, amount field, and memo.*

### Withdraw Flow – Dark Mode  
![MilkyPay Withdraw Dark Mode](./assets/images/MilkyPayWithdrawDarkMode.png)  
*Dark-mode withdrawal screen for moving funds out, showing destination network and fees.*

### Withdraw Flow – Light Mode  
![MilkyPay Withdraw Light Mode](./assets/images/MilkyPayWithdrawLightMode.png)  
*Light-mode withdraw interface with destination address, amount input, and Confirm button.*


## Technical Architecture

MilkyPay combines several technologies to create a seamless, user-friendly payment experience:

### Core Components

1. **Frontend (React + TypeScript)**
   - Voice recognition via Web Speech API
   - NLU (Natural Language Understanding) engine for intent parsing
   - Responsive UI with light/dark mode support
   - Local storage for transaction history and preferences

2. **Blockchain Integration**
   - Direct integration with Stellar SDK
   - Claimable Balances for recipient-controlled withdrawals
   - Multi-chain support with FastToken (FTN) integration
   - Client-side keypair generation and management

3. **Backend Services**
   - Express.js + TypeScript API layer
   - SMS notification service (Twilio)
   - PIN management system for claim verification
   - Fiat anchor integration services

### Key Technologies

- **Stellar SDK**: For wallet creation, transaction building, and blockchain interactions
- **Web Speech API**: For voice command recognition and response
- **Framer Motion**: For fluid animations and transitions
- **Styled Components**: For responsive and theme-aware styling
- **React**: For component-based UI development with hooks
- **TypeScript**: For type-safe code across both frontend and backend

## Repository Structure

```
MilkyPay-hackathon/
├─ README.md
├─ .env                # Environment variables (no secrets checked in)
├─ frontend/           # React PWA + Voice Chat UI
│  ├─ package.json
│  ├─ public/          # static assets, PWA manifest
│  └─ src/
│     ├─ components/
│     │  ├─ ChatWidget.tsx        # Voice UI, transcripts, chat bubble
│     │  ├─ WalletLoader.tsx      # Create wallet, show publicKey & QR
│     │  ├─ ClaimLink.tsx         # PIN form → claimable balance
│     │  └─ OffRampOptions.tsx    # Select anchor & off‑ramp
│     ├─ services/
│     │  ├─ api.ts               # Axios wrapper, auth headers
│     │  └─ nlu.ts               # Regex or LLM prompt parsing
│     ├─ hooks/                  # Custom React hooks (useWallet, useSpeech)
│     ├─ App.tsx                 # Main router & context providers
│     └─ index.tsx               # Entry point, service worker init
├─ backend/            # Express + TypeScript + Stellar SDK
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ src/
│     ├─ controllers/
│     │  ├─ walletController.ts  # /wallet/new, /wallet/claim
│     │  └─ txController.ts      # /tx/send, /tx/offramp, /tx/refund
│     ├─ services/
│     │  ├─ stellarService.ts    # Horizon API calls, tx builders
│     │  ├─ pinService.ts        # Generate & validate PINs, rate‑limit
│     │  └─ anchorService.ts     # Real or stub anchor integration
│     ├─ models/
│     │  └─ Link.ts              # SQLite or in‑memory schema
│     ├─ routes.ts              # Route definitions & middleware
│     └─ index.ts               # Express app bootstrap
└─ contracts/          # Smart contracts (for Soroban integration)
   └─ MilkyPay/        # Soroban smart contract for escrow
      ├─ Cargo.toml
      └─ src/lib.rs    # Rust-based escrow contract
```

## MilkyPay in Action

MilkyPay simplifies cross-border payments through a frictionless flow:

1. **Wallet Creation**: Users get an instant self-custodial wallet with one click
2. **Deposit**: Users can fund their wallet through various on-ramp options
3. **Voice-Driven Transfers**: Simple voice commands like "Send $20 to +1-905-805-2755"
4. **Link Generation**: System generates a secure claim link with PIN
5. **SMS Notification**: Recipient gets an SMS with claim link and PIN
6. **Claiming Funds**: Recipient enters PIN to claim funds to a temporary wallet
7. **Off-Ramping**: Various options to withdraw to local bank account or cash pickup

### Security Features

- Full client-side encryption of seed phrases
- PIN-based claim authentication
- Rate-limiting on PIN attempts
- Self-custodial approach (no central storage of keys)
- SMS verification for claim links

## Stellar Integration

MilkyPay demonstrates the power of Stellar's unique features:

### 1. Claimable Balances

We leverage Stellar's native Claimable Balances for the link + PIN system:

```typescript
// Creating a claimable balance with PIN in memo
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
  // Add memo with PIN for verification
  .addMemo(StellarSdk.Memo.text(`PIN:${pin}`))
  .setTimeout(30)
  .build();
```

### 2. Low Transaction Fees

Stellar's negligible transaction fees make micro-remittances practical:

- Average transaction cost: < $0.0001 USD
- No gas price volatility
- Predictable fees for better UX

### 3. Fast Settlement

With 3-5 second confirmation times, recipients get near-instant access to funds:

```typescript
// Submit the transaction
const result = await server.submitTransaction(transaction);
console.log('Transaction submitted successfully:', result);
```

### 4. Anchor Integration

The architecture supports Stellar Ecosystem Proposal (SEP) standards for anchor integration:

- SEP-6/24 for deposit/withdrawal
- SEP-10 for authentication
- SEP-12 for KYC submission
- SEP-31 for direct fiat transfers

This enables seamless on/off-ramping to local currencies worldwide.

## Multi-Chain Support

MilkyPay demonstrates cross-chain capabilities by integrating both:

1. **Stellar (XLM)**: Primary currency for all transactions
2. **Bahamut Network (FTN)**: Secondary support for FastToken

The application automatically converts and displays balances in both networks:

```typescript
// Calculate FTN balance (FastToken on Bahamut network)
const FTN_CONVERSION_RATE = 5.0; // 1 XLM = 5 FTN
const ftnNumericBalance = numericBalance * FTN_CONVERSION_RATE;
const formattedFtnBalance = ftnNumericBalance.toFixed(7);
```

Users see their balance in three formats:
- USD (fiat equivalent)
- XLM (Stellar native token)
- FTN (Bahamut network's FastToken)

This approach demonstrates the power of multi-chain integration while maintaining a simple UX.

## Voice-First Approach

MilkyPay's voice interface uses Web Speech API with a custom NLU engine:

```typescript
// Extract the phone number with improved regex
// Phone pattern specifically for format like +1-905-805-2755 with cleanup
if (phone.startsWith('+')) {
  const stripped = '+' + phone.substring(1).replace(/\D/g, '');
  console.log(`Formatting phone number from "${phone}" to "${stripped}"`);
  phone = stripped;
}
```

The NLU system can:
- Parse payment amounts
- Recognize phone numbers in various formats
- Handle queries about balance and transaction history
- Process memo text for transfers
- Manage cancellation and confirmation commands

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- A Stellar testnet account (optional, app can create one)
- Twilio account for SMS functionality (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/MilkyPay.git
cd MilkyPay
```

2. Install dependencies
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. Create `.env` files in root, frontend, and backend directories with appropriate configuration

4. Start the backend
```bash
cd backend
npm run dev
```

5. Start the frontend
```bash
cd frontend
npm start
```

6. Open your browser to `http://localhost:3000`

## Project Description

### Short Summary (150 chars)
Voice-enabled, self-custodial Stellar remittance tool with link+PIN claiming system and fiat on/off-ramps for frictionless cross-border payments.

### Full Description

MilkyPay addresses several key challenges in the global remittance space:

#### Problems Solved

1. **Complex User Experience**: Traditional remittance services and crypto wallets have steep learning curves. MilkyPay's voice interface allows users to simply speak what they want to do, eliminating navigation complexity.

2. **Recipient Wallet Requirements**: Most crypto payment solutions require recipients to have wallets. MilkyPay's link + PIN system allows anyone with a phone to receive funds without installing software or creating accounts.

3. **High Fees**: Traditional remittance services charge 5-7% on average. Stellar's negligible fees (< $0.0001 per transaction) make micro-remittances economically viable.

4. **Slow Settlement**: Bank transfers can take days for international settlements. MilkyPay leverages Stellar's 3-5 second confirmation time for near-instant transfers.

5. **Currency Conversion Complexity**: Managing exchange rates is typically a user burden. MilkyPay handles this behind the scenes, showing equivalent values in USD, XLM, and FTN.

#### How Stellar Technology Was Used

MilkyPay leverages several key Stellar features:

1. **Claimable Balances**: The core link + PIN system uses Stellar's native Claimable Balances feature, which allows funds to be set aside for specific claimants with custom conditions. We use the memo field to securely associate PINs with claims.

2. **Anchors Integration**: The architecture supports integration with Stellar anchors via SEP standards, enabling on/off-ramping to fiat currencies through local financial institutions worldwide.

3. **Memo Field Utilization**: We use the transaction memo field to include transfer notes and PIN information, enriching the payment experience with context and security.

4. **Account Creation**: Client-side keypair generation leverages Stellar's simple account system, with friendbot integration for testnet funding.

5. **Multi-Asset Support**: The app demonstrates Stellar's multi-asset capabilities, showing balances in both XLM and USD equivalent values.

### Technical Description

#### SDKs and Technologies

1. **Stellar SDK Integration**:
   - stellar-sdk v10.4.1 for all blockchain interactions
   - Horizon API for account operations and transaction submission
   - Custom wrapper services for specific operations (send, claim, etc.)

2. **Voice Processing Stack**:
   - Web Speech API for recognition and synthesis
   - Custom NLU module with regex-based intent parsing
   - Text-to-speech feedback for operation confirmation

3. **Frontend Technologies**:
   - React with TypeScript for component-based UI
   - Framer Motion for fluid animations
   - Local Storage for persistent transaction history and preferences
   - Styled-components for theming (light/dark mode)

4. **Backend Services**:
   - Express.js with TypeScript for API endpoints
   - Twilio integration for SMS delivery
   - Custom PIN service for generation and validation
   - Mock anchor service for fiat on/off-ramp simulation

#### Unique Stellar Features Utilized

1. **Claimable Balances**: Stellar's native support for claimable balances eliminates the need for complex smart contracts, making the link + PIN system more efficient and less prone to bugs.

2. **Low Fees**: The negligible transaction costs on Stellar (< $0.0001) make micro-remittances economically viable, a key advantage over other blockchain networks with higher gas fees.

3. **Fast Finality**: Stellar's 3-5 second confirmation time enables near-instant notifications and balance updates, creating a much more responsive user experience than traditional financial networks.

4. **Memo Field**: The flexible memo field allows us to include transaction context (notes, PINs) without requiring additional storage or smart contract complexity.

5. **Asset Interoperability**: Stellar's multi-asset support facilitates straightforward integration with both native XLM and FastToken (FTN), demonstrating cross-chain capabilities.

This combination of features makes MilkyPay uniquely positioned in the remittance space - offering a voice-first, user-friendly interface that abstracts away blockchain complexity while leveraging Stellar's speed, low fees, and global reach.

### Canva Slides Presentation
- [Presentation Slides](https://www.canva.com/design/DAGnnBhWj0s/8PjVPO7r6JrhTPeXTqSINQ/edit?utm_content=DAGnnBhWj0s&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

© 2025 MilkyPay
