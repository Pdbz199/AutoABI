import axios from 'axios'
import * as fs from 'fs'
import * as cheerio from 'cheerio'
import * as jsonfile from 'jsonfile'
import * as mkdirp from 'mkdirp'

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
    private static async downloadABI(unparsedABI: string, contractName: string, path?: string) {
        if (!path) path = './ABIs/'
        let updatedPath = (path.endsWith('/') ? path : (path + '/')) + `${contractName}.json`
        if (!fs.existsSync(path)) await mkdirp(path)
        jsonfile.writeFileSync(updatedPath, JSON.parse(unparsedABI))
    }

    public static async getABI(contractAddress: string, download?: boolean, path?: string): Promise<ABI> {
        let response = await axios.get(`https://etherscan.io/address/${contractAddress}#code`)
        const $ = cheerio.load(response.data)
        let contractName = $('#ContentPlaceHolder1_contractCodeDiv').find('.h6.font-weight-bold.mb-0').html()
        const unparsedABI = $('#js-copytextarea2').html()
        if (download) this.downloadABI(unparsedABI, contractName, path)
        return new ABI(unparsedABI)
    }

    public static async getABIs(contractAddresses: Array<string>, download?: boolean, path?: string): Promise<Array<ABI>> {
        let contractABIs: Array<ABI> = []
        for (let i = 0; i < contractAddresses.length; i++) {
            contractABIs.push(await AutoABI.getABI(contractAddresses[i], download, path))
            await new Promise(r => setTimeout(r, 650)) // to avoid potential spam error
        }
        return contractABIs
    }

    public static async getABIFromAPI(contractAddress: string, download?: boolean, path?: string, contractName?: string): Promise<ABI> {
        let response = await axios.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`)
        if (response.data.status == 0) throw response.data.result
        if (download) this.downloadABI(response.data.result, contractName, path)
        return new ABI(response.data.result)
    }
}

export default AutoABI
