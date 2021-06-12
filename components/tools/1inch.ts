import {LimitOrderBuilder, Web3ProviderConnector} from '@1inch/limit-order-protocol';
import {limitOrderProtocolAbi} from "./abis/LimitOrderProtocol";

import {erc20Abi} from "./abis/ERC20";
import Web3 from "web3";
import {jsx} from "@emotion/react";


const limitOrderAddresses = {
    1: "",
    3: "",
    4: "",
    5: "",
    42: "0x94Bc2a1C732BcAd7343B25af48385Fe76E08734f"
}

const makerAddresses = {
    1: "",
    3: "",
    4: "",
    5: "",
    42: "0xA916DCFf98E05D593DFC526d928718fDD3831c52"
}


export const backendAddress = "http://185.241.53.33:3001"


export const submitOrder = async (
    web3: Web3,
    netId: number,

    limitOrderContractAddress: string,
    makerAddress: string,
    makerAssetAddress: string,
    takerAssetAddress: string,
    makerAmount: string,
    takerAmount: string,
    tradeToAddress: string,
    margin: number
) => {
// You can create and use a custom provider connector (for example: ethers)

    // @ts-ignore
    const connector = new Web3ProviderConnector(web3);

    const limitOrderBuilder = new LimitOrderBuilder(
        limitOrderContractAddress,
        netId,
        connector
    );

    const limitOrderStruct = {
        makerAssetAddress: makerAssetAddress,
        takerAssetAddress: takerAssetAddress,
        makerAddress: makerAddress,
        makerAmount: makerAmount,
        takerAmount: takerAmount,
        predicate: '0x',
        permit: '0x',
        interaction: web3.eth.abi.encodeParameters(
            ['address', 'uint256'], [tradeToAddress, margin]
        )
    }

    // const newNotEncodedHash = web3.utils.keccak256(JSON.stringify({
    //     ...limitOrderStruct,
    //     random: Math.random()
    // }))

    // const newHashEncoded = web3.eth.abi.encodeParameter("bytes32", newNotEncodedHash)
    // const newLimitOrder = {...limitOrderStruct, interaction: newNotEncodedHash}

    const newLimitOrder = limitOrderStruct

    const limitOrder = limitOrderBuilder.buildLimitOrder(newLimitOrder);

    return {
        limitOrder,
        limitOrderStruct: newLimitOrder
    }
    // await fetch(backendAddress + "/create?" + "data=" + JSON.stringify({
    //     limitOrder,
    //     limitOrderStruct: newLimitOrder
    // }))

    // to backend
    // const makerAssetContract = new web3.eth.Contract(erc20Abi, makerAssetAddress)
    // await (makerAssetContract.methods.approve(makerAddress, makerAmount)).send({from: walletAddress});
    //
    // const ppContract = new web3.eth.Contract(ppContractAbi, makerAddress);
    // await ppContract.methods.createOrder(newNotEncodedHash, makerAssetAddress, makerAmount).send({from: walletAddress});
}

const orderExample = {
    limitOrder: {
        salt: '146753921826',
        makerAsset: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
        takerAsset: '0xf3e0d7bf58c5d455d31ef1c2d5375904df525105',
        makerAssetData: '0x23b872dd000000000000000000000000de968842ba9ad7c9a6085e5a9ad1af7fede4753500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a7640000',
        takerAssetData: '0x23b872dd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de968842ba9ad7c9a6085e5a9ad1af7fede475350000000000000000000000000000000000000000000000000de0b6b3a7640000',
        getMakerAmount: '0xf4a215c30000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000',
        getTakerAmount: '0x296637bf0000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000de0b6b3a7640000',
        predicate: '0x',
        permit: '0x',
        interaction: '0xcbb4c35562c36706f881de6d286a78c17cad6c3ab9544608d2b53f4595423f0d'
    },
    limitOrderStruct: {
        makerAssetAddress: '0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa',
        takerAssetAddress: '0xf3e0d7bf58c5d455d31ef1c2d5375904df525105',
        makerAddress: '0xdE968842ba9aD7c9A6085e5A9Ad1Af7fEDE47535',
        makerAmount: '1000000000000000000',
        takerAmount: '1000000000000000000',
        predicate: '0x',
        permit: '0x',
        interaction: '0xcbb4c35562c36706f881de6d286a78c17cad6c3ab9544608d2b53f4595423f0d'
    }
}


type Order = typeof orderExample

const OrderSol = [
    {name: 'salt', type: 'uint256'},
    {name: 'makerAsset', type: 'address'},
    {name: 'takerAsset', type: 'address'},
    {name: 'makerAssetData', type: 'bytes'},
    {name: 'takerAssetData', type: 'bytes'},
    {name: 'getMakerAmount', type: 'bytes'},
    {name: 'getTakerAmount', type: 'bytes'},
    {name: 'predicate', type: 'bytes'},
    {name: 'permit', type: 'bytes'},
    {name: 'interaction', type: 'bytes'},
];

const ABIOrder = {
    'Order': OrderSol.reduce((obj: { [key: string]: string }, item) => {
        obj[item.name] = item.type;
        return obj;
    }, {}),
};

export const fillOrder = async (
    web3: Web3,
    fillerAddress: string,
    order: Order,
    limitOrderContractAddress: string,
) => {
    const signature = web3.eth.abi.encodeParameter(ABIOrder, order.limitOrder);

    // approve
    const takerAsset = new web3.eth.Contract(erc20Abi, order.limitOrderStruct.takerAssetAddress)
    await (takerAsset.methods.approve(limitOrderContractAddress, order.limitOrderStruct.takerAmount)).send({from: fillerAddress});

    // fill order
    const limitOrderProtocol = new web3.eth.Contract(limitOrderProtocolAbi, limitOrderContractAddress);

    // @ts-ignore
    var BN = web3.utils.BN;
    const trash = (new BN(order.limitOrderStruct.makerAmount).sub(new BN(1))).toString()


    await limitOrderProtocol.methods.fillOrder(order.limitOrder, signature, "0", order.limitOrderStruct.takerAmount, trash).send({from: fillerAddress});

    // await fetch(backendAddress + "/delete?" + "hash=" + order.limitOrderStruct.interaction)
}
