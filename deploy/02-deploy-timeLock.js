const { network } = require('hardhat')
const { developmentChains, MIN_DELAY } = require('../helper-hardhat-config')
const verify = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------")
    log("Deploying TimeLock contract...")
    const token = await deploy("TimeLock", {
        from: deployer,
        args: [MIN_DELAY, [], [], deployer],
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(token.address, [])
    }
}

module.exports.tags = ["all", "timeLock"]