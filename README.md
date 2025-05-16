# BridgeBotPay - Voice-Enabled Cross-Border Payments

![BridgeBotPay Logo](https://stellar.org/images/stellar-logo.png)

## 🌉 Overview

BridgeBotPay is a **voice-enabled**, **self‑custodial** Stellar remittance tool that mimics an e‑transfer. Users generate a wallet, load funds, and send money across borders via a simple **link + PIN** flow. A built‑in AI assistant handles voice commands for sending, claiming, off‑ramping, and refunds—all powered by Stellar's low‑fee network and local fiat anchors.

## ✨ Key Features

* **Self‑Custodial Wallets**: Client‑side key generation and secure seed storage (encrypted, mnemonic backup, optional SEP‑30 recovery).
* **Voice‑First UX**: Web Speech API + NLU for commands like "Send \$10 to +2547…" and spoken confirmations.
* **Link + PIN Claim**: On‑chain Claimable Balances (or Soroban escrow contracts) for recipients—no wallet install needed.
* **Fiat On/Off‑Ramps**: Integrated anchor APIs (Flutterwave, MoneyGram, etc.) abstracted under the voice/chat UI.
* **Refund & History**: Full transaction history with voice queries ("What did I send yesterday?") and one‑tap refunds.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Styled Components, Framer Motion
- **Blockchain**: Stellar SDK
- **Voice**: Web Speech API, Custom NLU processing
- **State Management**: React Hooks, Context API
- **UI/UX**: Custom component library, Responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bridgebotpay-hackathon.git
   cd bridgebotpay-hackathon
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start backend
   cd backend
   npm run dev
   
   # In a new terminal, start frontend
   cd frontend
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🎯 User Flow

1. **Create Wallet**: Generate a self-custodial Stellar wallet
2. **Fund Wallet**: Use testnet faucet (or connect to real anchors in production)
3. **Send Money**: Use voice commands or text interface to send money across borders
4. **Claim Funds**: Recipients claim via link + PIN, no wallet needed
5. **Withdraw**: Cash out to local currency via multiple off-ramp options

## 🔗 API Documentation

The backend exposes the following key endpoints:

- `POST /api/wallet/new`: Create a new Stellar wallet
- `GET /api/wallet/:id`: Get wallet details
- `POST /api/tx/send`: Send a payment 
- `POST /api/tx/claim`: Claim a claimable balance
- `POST /api/tx/offramp`: Initiate fiat withdrawal

## 🔮 Future Work

- **Enhanced Security**: SEP-30 recovery options, multi-party keys
- **Advanced Voice NLU**: Integration with OpenAI for more natural language understanding
- **More Anchors**: Integration with additional fiat on/off ramps globally
- **Soroban Smart Contracts**: Replace claimable balances with custom Soroban contracts
- **Mobile Native**: Convert to React Native for full mobile experience

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Stellar Development Foundation
- Soroban Team
- All the anchor partners making fiat on/off ramps possible