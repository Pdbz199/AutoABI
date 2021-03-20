import axios from 'axios'
import * as cheerio from 'cheerio'
import { ContractInterface } from 'ethers'
import { throws } from 'node:assert'

export class ABI {
    public abiString: string
    public abiJSON: Array<any>
    public readableABI: any
    public length: number

    constructor(abiString: string) {
        this.abiString = abiString
        this.abiJSON = JSON.parse(abiString)
        this.length = this.abiJSON.length

        this.readableABI = { "functions": {}, "events": {} }
        this.abiJSON.forEach(entry => {
            if (entry.type === 'function') {
                this.readableABI.functions[entry.name] = entry
            } else if (entry.type === 'event') {
                this.readableABI.events[entry.name] = entry
            }
        })
    }

    public getFunctions(): any {
        return this.readableABI.functions
    }

    public getFunctionInputs(functionName: string): Array<any> {
        return this.readableABI.functions[functionName].inputs
    }

    public getEvents(): any {
        return this.readableABI.events
    }
}

export class AutoABI {
    public static async getABI(contractAddress: string): Promise<ABI> {
        let response = await axios.get(`https://etherscan.io/address/${contractAddress}#code`)
        const $ = cheerio.load(response.data)
        const unparsedABI = $('#js-copytextarea2').html()
        return new ABI(unparsedABI)
    }

    public static async getABIs(contractAddresses: Array<string>): Promise<Array<ABI>> {
        let contractABIs: Array<ABI> = []
        for (let i = 0; i < contractAddresses.length; i++) {
            contractABIs.push(await AutoABI.getABI(contractAddresses[i]))
            await new Promise(r => setTimeout(r, 650)) // to avoid potential spam error
        }
        return contractABIs
    }

    public static async getABIFromAPI(contractAddress: string): Promise<ABI> {
        let response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`)
        if (response.data.status == 0) throw response.data.result
        return new ABI(response.data.result)
    }
}

export default AutoABI