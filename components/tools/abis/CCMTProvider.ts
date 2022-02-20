import {AbiItem} from "web3-utils";

// @ts-ignore
export const CCMTProvider = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_limitOrderProtocol",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_feeManager",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "uniq_id",
                "type": "uint256"
            }
        ],
        "name": "TradeClosed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "uniq_id",
                "type": "uint256"
            }
        ],
        "name": "TradeCreated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "LIMIT_ORDER_TYPEHASH",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "balance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ccmtToken",
        "outputs": [
            {
                "internalType": "contract CCMTToken",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "uniq_id",
                "type": "uint256"
            }
        ],
        "name": "closeTrade",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "feeManager",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "uniq_id",
                "type": "uint256"
            }
        ],
        "name": "getTradeInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "address",
                        "name": "fromAsset",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "toAsset",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deposited",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "depositedWithMargin",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "firstPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdTimestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct CCMTTrade.Trade",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "isValidSignature",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "limitOrderProtocol",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "makerAsset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "takerAsset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "makingAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "takingAmount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "interactiveData",
                "type": "bytes"
            }
        ],
        "name": "notifyFillOrder",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "requestAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "fromAsset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "toAsset",
                "type": "address"
            }
        ],
        "name": "requestTokenAmountOrRevert",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "trades",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "address",
                "name": "fromAsset",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "toAsset",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "deposited",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "depositedWithMargin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "firstPrice",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "createdTimestamp",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as AbiItem[]