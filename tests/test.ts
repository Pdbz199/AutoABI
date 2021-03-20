import * as dotenv from 'dotenv'
import { AutoABI, ABI } from '../index'
import { ethers } from 'ethers'

dotenv.config()

const ONE_SECOND = 1000
const provider: ethers.providers.BaseProvider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_API_KEY)

// const rateReqs = [10, 25, 50]
const rateReqs = [1]
rateReqs.forEach(reqCount => {
    test(`Rate limit test (${reqCount})`, async () => {
        let contractAddress: string = "0xeeDcD34aCd9f87aAE1eB47f06e42868E81ad2924"

        let contractABIs = []
        for (let i = 0; i < reqCount; i++) {
            contractABIs.push(await AutoABI.getABI(contractAddress))
            await new Promise(r => setTimeout(r, 600)) // to avoid potential spam error
        }
        contractABIs.forEach(ABI => {
            expect(ABI.length).toBe(34)
        })
    }, 200 * ONE_SECOND)
})

test('getABIs test', async () => {
    let contractAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"

    let contractAddresses = []
    for(let i=0;i<rateReqs[rateReqs.length-1];i++) contractAddresses.push(contractAddress)
    let result = await AutoABI.getABIs(contractAddresses)
    expect(result.length).toBe(contractAddresses.length)
}, 100 * ONE_SECOND)

test('getABIFromAPI test', async () => {
    let contractAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"

    let result = await AutoABI.getABIFromAPI(contractAddress)
    expect(result).toBeInstanceOf(ABI)
})

test('Use ABI test', async () => {
    let contractAddress: string = "0xeeDcD34aCd9f87aAE1eB47f06e42868E81ad2924"

    let contractABI = await AutoABI.getABI(contractAddress)
    expect(contractABI).toBeInstanceOf(ABI)
    let contract = new ethers.Contract(contractAddress, contractABI.abiString, provider)
    expect(await contract.name()).toBe('Uniswap V2')

    let signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    contract = new ethers.Contract(contractAddress, contractABI.abiString, signer)
    expect(await contract.name()).toBe('Uniswap V2')
})