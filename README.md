# AutoABI

A TypeScript/JavaScript library for finding and loading smart contract ABIs without manually retrieving them.

## Installation

Use [npm](https://www.npmjs.com/) to install [AutoABI](https://www.npmjs.com/package/autoabi).

```bash
npm install autoabi --save
```

## Usage

Import
```Node.js
const AutoABI = require('autoabi')
```

Get a single contract's ABI
```Node.js
let contractABI = await AutoABI.getABI("0xeeDcD34aCd9f87aAE1eB47f06e42868E81ad2924") // returns ABI object
```

Get a single contract's ABI with etherscan API
```Node.js
let contractABI = await AutoABI.getABIFromAPI("0xeeDcD34aCd9f87aAE1eB47f06e42868E81ad2924") // returns ABI object
```

Get many contracts' ABIs
```Node.js
let contractABIs = await AutoABI.getABIs(["0xeeDcD34aCd9f87aAE1eB47f06e42868E81ad2924", "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359"]) // returns array of ABI objects
```

## ABI Object

```Node.js
let contractABI = await AutoABI.getABI("0xeeDcD34aCd9f87aAE1eB47f06e42868E81ad2924")

console.log(contractABI.abiString) // Prints ABI in string format

console.log(contractABI.abiJSON) // Prints ABI in JSON format

console.log(contractABI.readableABI) // Prints a readable JSON format of ABI

console.log(contractABI.length) // Prints length of ABI JSON array

console.log(contractABI.getFunctions()) // Prints object of all functions from ABI

console.log(contractABI.getFunctionInputs('aFunction')) // Prints object of inputs required for 'aFunction'

console.log(contractABI.getEvents()) // Prints object of all events from ABI
```

## License
[MIT](https://choosealicense.com/licenses/mit/)