const { network, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const verify = require('../utils/verify')

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const {deployer} = await getNamedAccounts()

    log("--------------------------------------")
    log("Deploying governance token...")
    const token = await deploy("GovToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmation: network.config.blockConfirmations || 1
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(token.address, [])
    }

    log(`Delegating to ${deployer}`)
    await delegate(token.address, deployer)
    log("Delegated!")
}

const delegate = async (govTokenAddress, delegatedAccount) => {
    const govToken = await ethers.getContractAt("GovToken", govTokenAddress)
    const txResponse = await govToken.delegate(delegatedAccount)
    await txResponse.wait(1)
    console.log(`Checkpoints: ${await govToken.numCheckpoints(delegatedAccount)}`)
    console.log(`Nonces: ${await govToken.nonces(delegatedAccount)}`)
}

module.exports.tags = ["all", "govToken"]