const { deployments, ethers, network } = require('hardhat')
const { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, developmentChains, MIN_DELAY } = require('../helper-hardhat-config')
const moveBlock = require('../utils/move-blocks')
const moveTime = require('../utils/move-time')

const queueAndexecute = async () => {
    const args = [NEW_STORE_VALUE]
    const boxDeployment = await deployments.get("Box")
    const box = await ethers.getContractAt("Box", boxDeployment.address)
    
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION))
    
    const governorDeployment = await deployments.get("MyGovernor")
    const governor = await ethers.getContractAt("MyGovernor", governorDeployment.address)

    const queueTx = await governor.queue([box.target], [0], [encodedFunctionCall], descriptionHash)
    await queueTx.wait(1)

    if(developmentChains.includes(network.name)){
        await moveTime(MIN_DELAY + 1)
        await moveBlock(1)
    }

    console.log("Executing...")
    const executeTX = await governor.execute([box.target], [0], [encodedFunctionCall], descriptionHash)
    await executeTX.wait(1)

    const boxNewValue = await box.retrieve()
    console.log("New box value: ", boxNewValue.toString())
}

queueAndexecute()
    .then(() => process.exit(1))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })