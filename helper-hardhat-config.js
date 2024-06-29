const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: process.env.SEPOLIA_PRICEFEED_ADDRESS
    },
}

const developmentChains = ["hardhat", "localhost"]

MIN_DELAY = 3600

QUORUM_PERCENTAGE = 4

VOTING_PERIOD = 10 // blocks

// VOTING_PERIOD = 50400 // 1 week

VOTING_DELAY = 1 // blocks or 7200

ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"

NEW_STORE_VALUE = 77

FUNC = "store"

PROPOSAL_DESCRIPTION = "Proposal #1: 77 in the Box!"

module.exports = {
    networkConfig,
    developmentChains,
    MIN_DELAY,
    QUORUM_PERCENTAGE,
    VOTING_DELAY,
    VOTING_PERIOD,
    ADDRESS_ZERO,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION
}