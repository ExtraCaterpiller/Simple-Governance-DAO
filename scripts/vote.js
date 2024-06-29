const { ethers, network, deployments } = require('hardhat')
const moveBlocks = require('../utils/move-blocks')
const { developmentChains, VOTING_PERIOD } = require('../helper-hardhat-config')
const fs = require('fs')
const path = require('path')

const proposalFilePath = path.resolve(__dirname, "../proposal.json")

async function vote() {
    const proposals = JSON.parse(fs.readFileSync(proposalFilePath, "utf-8"))
    const proposalId = proposals[network.config.chainId][0]

    const myVote = 1
    const reason = "I like to do bla bla bla"

    console.log("voting....")
    const governorDeployment = await deployments.get("MyGovernor")
    const governor = await ethers.getContractAt("MyGovernor", governorDeployment.address)
    const voteTx = await governor.castVoteWithReason(proposalId, myVote, reason)
    const voteTxReceipt = await voteTx.wait(1)
    console.log(voteTxReceipt.logs[0].args.reason)
    console.log(voteTxReceipt.logs[0].args.weight)

    const proposalState = await governor.state(proposalId)
    console.log(`Current proposal State: ${proposalState}`)

    if(developmentChains.includes(network.name)){
        await moveBlocks(VOTING_PERIOD+1)
    }

    console.log(`Current proposal State: ${await governor.state(proposalId)}`)
}

vote()
    .then(() => process.exit(1))
    .catch((e) => {
        console.log(e)
        process.exit(1)
    })