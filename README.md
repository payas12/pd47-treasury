# PD-47: The Luxury AI Treasury 💎

**PD-47** is a programmable commerce vault built for the **MNEE Hackathon**. It solves the trust gap between Luxury Brands and AI Artists using the MNEE Stablecoin.

## 🚀 How it Works
1. **Escrow:** Client creates a job and deposits funds.
2. **Verify:** Creative Director manually approves the work (Human-in-the-Loop).
3. **Agent Settlement:** An autonomous Node.js Agent detects the approval and instantly pays the freelancer in MNEE.

## 🛠 Tech Stack
- **Frontend:** Next.js (Custom Luxury Theme)
- **Smart Contract:** Solidity (ERC-20 Settlement)
- **Agent:** Node.js (Hardhat Script)
- **Payment Rail:** MNEE Stablecoin (Mainnet Compatible)
- *Built using Scaffold-ETH 2*

## 🎥 Demo
[LINK TO YOUR YOUTUBE VIDEO HERE]

## 📦 How to Run

1. `yarn install`
2. `yarn chain`
3. `yarn deploy`
4. `yarn start`
5. **Run the Agent:** `npx hardhat run packages/hardhat/scripts/pay_freelancer.js --network localhost`

## ⚖️ License
MIT License