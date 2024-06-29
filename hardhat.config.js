require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy')
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URl,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      timeout: 30000,
      blockConfirmations: 6
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    //outputFile: 'gas-reporter.txt',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY
    }
  }
};
