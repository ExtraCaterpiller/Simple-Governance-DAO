const { ethers, deployments, network } = require('hardhat')
const { FUNC, PROPOSAL_DESCRIPTION, NEW_STORE_VALUE, developmentChains, VOTING_DELAY } = require('../helper-hardhat-config')
const moveBlocks = require('../utils/move-blocks')
const fs = require('fs')
const path = require('path')

const proposalFilePath = path.resolve(__dirname, "../proposal.json")

async function propose(args, functionToCall, proposalDescription) {
    const boxDeployment = await deployments.get("Box")
    const box = await ethers.getContractAt("Box", boxDeployment.address)
    const governorDeployment = await deployments.get("MyGovernor")
    const governor = await ethers.getContractAt("MyGovernor", governorDeployment.address)

    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args
    )
    console.log(`Proposing ${functionToCall} on ${box.target} with ${args}`)
    console.log(`Proposal description: ${PROPOSAL_DESCRIPTION}`)

    const proposeTx = await governor.propose(
        [box.target],
        [0],
        [encodedFunctionCall],
        proposalDescription
    )
    const proposeTxReceipt = await proposeTx.wait(1)

    if(developmentChains.includes(network.name)){
        await moveBlocks(VOTING_DELAY+1)
    }

    const proposalId = proposeTxReceipt.logs[0].args.proposalId
    console.log(`Proposal Id: ${proposalId}`)
    await storeProposalId(proposalId)

    const proposalState = await governor.state(proposalId)
    const proposalSnapshot = await governor.proposalSnapshot(proposalId)
    const proposalDeadline = await governor.proposalDeadline(proposalId)

    // 0:Pending, 1:Active, 2:Canceled, 3:Defeated, 4:Succeeded, 5:Queued, 6:Expired, 7:Executed
    console.log(`Current proposal State: ${proposalState}`)
    console.log(`Current proposal snapshot: ${proposalSnapshot}`)
    console.log(`Current proposal deadline: ${proposalDeadline}`)
}

const storeProposalId = async (id) => {
    const chainId = network.config.chainId
    let proposals

    if(fs.existsSync(proposalFilePath)){
        proposals = JSON.parse(fs.readFileSync(proposalFilePath, "utf-8"))
    } else {
        proposals = {}
        proposals[chainId] = []
    }

    proposals[chainId].push(id.toString())
    fs.writeFileSync(proposalFilePath, JSON.stringify(proposals), "utf-8")
}

propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(1))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })