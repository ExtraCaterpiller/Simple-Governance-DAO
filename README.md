# Simple Governance DAO

## Overview
Governance DAO leverages blockchain technology to enable decentralized governance, allowing community members to participate in decision-making through voting on proposals. This README provides an overview of the DAO structure, how to participate and guidelines for contributors.

## Features
- Decentralized Governance: Members can propose, vote, and execute changes autonomously.
- Token Voting: Voting power is determined by token ownership.
- Timelock: Delays execution of proposals to ensure consensus.
- Transparent Decision Making: All proposals and votes are publicly visible on the blockchain.

## Getting Started
To get started, follow these steps:
1. Install Dependencies: Ensure you have Node.js and Hardhat installed.
```
npm install
```

2. Set up environment variable: 
```
SEPOLIA_RPC_URl = https://sepolia.infura.io/v3/<YOUR_SEPOLIA_KEY>

SEPOLIA_PRIVATE_KEY = <YOUR_SEPOLIA_WALLET_PRIVATE_KEY>

ETHERSCAN_API_KEY = <YOUR_ETHERSCAN_API_KEY>

COINMARKETCAP_API_KEY = <YOUR_COINMARKEYCAP_API_KEY>
```
3. Spin up hardhat local node and run it will automatically deploy contracts in local node
```
npx hardhat node
```
4. Interact with DAO: Use the provided scripts to propose, vote, and execute changes.
```
npx hardhat run scripts/proposal.js --network localhost
```
NOTE: This is a demo project designed for learning and exploring blockchain technologies. It may have limitations and is not intended for production use.
