const ethers = require('ethers')
require('dotenv').config()

const provider = new ethers.JsonRpcProvider('https://ethereum-sepolia.publicnode.com');
const signer = new ethers.Wallet(process.env.ACCOUNT_PRIVATE_KEY, provider)

const CONTRACT_ADDRESS = "0x7F06E18980B1c697422bE0b6831f18c73e27BD98"
const CONTRACT_ABI = require('./abi.json') 
const FIRST_BLOCK = 5178036
const TIME_CALL = 24        //sec block creation
var timeStart = 0           //timestamp: 1706544144n,
var timeAttack = 0x65ba6f10 //31.01.2024 22:02:24
var latestBlock = 0

async function readBlock(blockNumber) {
    await provider.getBlock(blockNumber).then((data, err) => {
        timeStart = data.timestamp
        timeAttack = timeStart + (86400*2)
    })
    await getTotalParticipantsCall()
}

async function getTotalParticipantsCall() {
    var contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    var result = await contract.getTotalParticipants().then((total) => {
        console.log("TotalParticipants:", total)
    })
}

async function tryToSitSend() {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    const contractWithSigner = contract.connect(signer)
    const nonce = await provider.getTransactionCount(signer.address)
    const gasFee = String(Number((await provider.getFeeData()).gasPrice * 2n))
    // contract.tryToSit.estimateGas()
    // console.log(nonce, gasFee)
    var result = await contract.tryToSit("linkedin.com/in/bepossible")
    console.log(result)

    // await contract.tryToSit("Jo-ho-ho boy", { 
    //     gasPrice: gasFee,
    //     nonce: nonce
    // })
    // .then(rawTxn => {
    //     transaction(rawTxn, gasFee, nonce)
    // })
    // .catch(err => console.log(err.reason));
}

async function transaction(rawTxn, gasFee, nonce) {
	console.log("...Submitting transaction with gas price of:", ethers.utils.formatUnits(gasFee, "gwei"), " - & nonce:", nonce)
    let signedTxn = (await provider).sendTransaction(rawTxn)
    let reciept = (await signedTxn).wait()
    console.log(reciept);
    if (reciept) {
        console.log("Transaction is successful!!!" + '\n' + "Transaction Hash:", (await signedTxn).hash + '\n' + "Block Number: " + (await reciept).blockNumber + '\n' + "Navigate to https://polygonscan.com/tx/" + (await signedTxn).hash, "to see your transaction")
    } else {
        console.log("Error submitting transaction")
    }
}

padWithLeadingZeros = (num, totalLength) => {
    return String(num).padStart(totalLength, '0');
}

function remainingTime(timeAfter) {
    var timeNow = Math.floor(new Date().getTime()/1000)
    var difference = Number(timeAfter) - timeNow

    var daysDifference = Math.floor(difference/60/60/24)
    difference -= daysDifference*60*60*24

    var hoursDifference = Math.floor(difference/60/60)
    difference -= hoursDifference*60*60

    var minutesDifference = Math.floor(difference/60)
    difference -= minutesDifference*60

    var secondsDifference = Math.floor(difference);

    console.log('>>> ' + daysDifference + ' day/s ' + 
        padWithLeadingZeros(hoursDifference, 2) + ' : ' + 
        padWithLeadingZeros(minutesDifference, 2) + ' : ' + 
        padWithLeadingZeros(secondsDifference, 2));
    
    return Number(timeAfter) - timeNow
}

(async () => {
    var balance = await provider.getBalance(signer.address)
    console.log("account:", signer.address, "-", balance)
    await readBlock(FIRST_BLOCK)
    console.log("timestamp:", timeStart, "-", timeAttack)
    
    var diff = await remainingTime(timeAttack)
    console.log(diff)
    while(true) {
        let blockNumber = await provider.getBlockNumber()
        if(blockNumber != latestBlock) {
            let blockBefore = await provider.getBlock(latestBlock)
            let block = await provider.getBlock(blockNumber) 
            latestBlock = blockNumber      
            let gasPrice = (await provider.getFeeData()).gasPrice
            console.log("block:", blockNumber, ", time:", block.timestamp - blockBefore.timestamp, " = ", gasPrice) 
        }
        
        var diff = await remainingTime(timeAttack)
        
        if (diff < TIME_CALL) {
            await tryToSitSend()
            break;
        } else {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
})();