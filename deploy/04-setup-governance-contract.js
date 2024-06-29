const { ADDRESS_ZERO } = require('../helper-hardhat-config')
const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { log, get } = deployments
    const { deployer } = await getNamedAccounts()

    const timeLockDeployment = await get("TimeLock")
    const timeLock = await ethers.getContractAt("TimeLock", timeLockDeployment.address)
    const governorDeployment = await get("MyGovernor")
    const governor = await ethers.getContractAt("MyGovernor", governorDeployment.address)

    log("------------------------------")
    log("Setting up contracts for roles")
    
    const proposerRole = await timeLock.PROPOSER_ROLE()
    const executorRole = await timeLock.EXECUTOR_ROLE()
    const adminRole = await timeLock.DEFAULT_ADMIN_ROLE()

    const proposerTx = await timeLock.grantRole(proposerRole, governor.target)
    await proposerTx.wait(1)
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO)
    await executorTx.wait(1)
    const revokeTx = await timeLock.revokeRole(adminRole, deployer)
    await revokeTx.wait(1)
    
    log("Roles setting up successfull")

    log("Transferring ownership of government token to timelock")
    const tokenDeployment = await deployments.get("GovToken")
    const govToken = await ethers.getContractAt("GovToken", tokenDeployment.address)

    await govToken.transferOwnership(timeLock.target)
    log("Transfer successfull")
}

module.exports.tags = ["all", "setup"]