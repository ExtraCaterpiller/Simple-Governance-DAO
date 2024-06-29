const { network, ethers } = require('hardhat')
const { developmentChains, MIN_DELAY, QUORUM_PERCENTAGE, VOTING_DELAY, VOTING_PERIOD } = require('../helper-hardhat-config')
const verify = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    const tokenContract = await get("GovToken")
    const timeLockContract = await get("TimeLock")

    log("--------------------------------------")
    log("Deploying Governor contract...")
    const token = await deploy("MyGovernor", {
        from: deployer,
        args: [tokenContract.address, timeLockContract.address, QUORUM_PERCENTAGE, VOTING_PERIOD, VOTING_DELAY],
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(token.address, [])
    }
}

module.exports.tags = ["all", "timeLock"]