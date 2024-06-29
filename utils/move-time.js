const { network } = require('hardhat')

const moveTime = async (amount) => {
    console.log("Moving blocks...")
    await network.provider.send("evm_increaseTime", [amount])
    console.log(`Moved forward in time ${amount} blocks`)
}

module.exports = moveTime