const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()

    log("-------------------------------")
    log("Deploying Box contract")
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(box.address, [])
    }

    log("Transferring ownership...")

    const boxContract = await ethers.getContractAt("Box", box.address)
    const timeLockDeployment = await get("TimeLock")
    const timeLock = await ethers.getContractAt("TimeLock", timeLockDeployment.address)
    const transferOwnerTx = await boxContract.transferOwnership(timeLock.target)
    await transferOwnerTx.wait(1)

    log("Transferring ownership successfull")
}

module.exports.tags = ["all", "box"]