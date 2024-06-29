const { deployments, ethers, network } = require('hardhat')
const { expect } = require('chai')
const { developmentChains } = require('../../helper-hardhat-config')

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Box", () => {
        let box, timeLock

        beforeEach(async () => {

            await deployments.fixture(["all"])
            const boxDeployment = await deployments.get("Box")
            box = await ethers.getContractAt("Box", boxDeployment.address)

            const timeLockDeployment = await deployments.get("TimeLock")
            timeLock = await ethers.getContractAt("TimeLock", timeLockDeployment.address)
        })

        describe("constructor", () => {
            it("Owner is timeLock", async () => {
                expect(await box.owner()).to.equal(timeLock.target)
            })
            it("Initial value is zero", async () => {
                expect(await box.retrieve()).to.equal("0")
            })
        })

        it("store value can only be changed by timelock", async () => {
            await expect(box.store(77)).to.be.reverted
        })
    })