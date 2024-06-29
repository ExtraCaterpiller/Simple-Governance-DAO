const { deployments, ethers, network } = require('hardhat')
const assert = require('assert')
const { expect } = require('chai')
const { developmentChains, FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, VOTING_PERIOD, VOTING_DELAY } = require('../../helper-hardhat-config')
const moveBlocks = require('../../utils/move-blocks')
const moveTime = require('../../utils/move-time')

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Governor Flow", () => {
        let governor, govToken, timeLock, box
        const myVote = 1
        const reason = "bla bla bla"

        beforeEach(async () => {
            await deployments.fixture(["all"])
            const govTokenDeployment = await deployments.get("GovToken")
            govToken = await ethers.getContractAt("GovToken", govTokenDeployment.address)
            const timeLockDeployment = await deployments.get("TimeLock")
            timeLock = await ethers.getContractAt("TimeLock", timeLockDeployment.address)
            const governorDeployment = await deployments.get("MyGovernor")
            governor = await ethers.getContractAt("MyGovernor", governorDeployment.address)
            const boxDeployment = await deployments.get("Box")
            box = await ethers.getContractAt("Box", boxDeployment.address)
        })

        it("proposes, votes, waits, queues and executes", async () => {
            const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [NEW_STORE_VALUE])
            const proposeTX = await governor.propose([box.target], [0], [encodedFunctionCall], PROPOSAL_DESCRIPTION)
            const proposeTxReceipt = await proposeTX.wait(1)
            const proposalId = proposeTxReceipt.logs[0].args.proposalId
            let proposalState = await governor.state(proposalId)
            console.log(`Current proposal state: ${proposalState}`)

            await moveBlocks(VOTING_DELAY+1)

            const voteTx = await governor.castVoteWithReason(proposalId, myVote, reason)
            await voteTx.wait(1)
            proposalState = await governor.state(proposalId)
            assert.equal(proposalState.toString(), "1")
            console.log(`Current Proposal State: ${proposalState}`)

            await moveBlocks(VOTING_PERIOD + 1)

            console.log(`Current proposal state: ${await governor.state(proposalId)}`)
            const descriptionHash = ethers.keccak256(ethers.toUtf8Bytes(PROPOSAL_DESCRIPTION))
            const queueTx = await governor.queue([box.target], [0], [encodedFunctionCall], descriptionHash)
            await queueTx.wait(1)
            await moveTime(MIN_DELAY + 1)
            await moveBlocks(1)
            proposalState = await governor.state(proposalId)
            console.log(`Current proposal state: ${proposalState}`)

            console.log("Executing...")
            const executeTx = await governor.execute([box.target], [0], [encodedFunctionCall], descriptionHash)
            await executeTx.wait(1)
            expect(await box.retrieve()).to.equal(NEW_STORE_VALUE)
        })
    })