const ethers = require('ethers')

const CONTRACT_ADDRESS = "0x5E1c6Ee0702161aaEB79406c5221907fefa7627e"
const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');

provider.getBalance(CONTRACT_ADDRESS).then( balance => {
    console.log("account:", CONTRACT_ADDRESS, "-", balance)
})
