import * as React from "react";
import {useEffect, useState} from "react";
import {createProvider} from "../tools/react-provider";
import {useWeb3, Web3State} from "./web3-provider";

export type Proposition = {
    id: number,
    netId: number,
    limitOrderContractAddress: string,
    makerAddress: string
    makerAssetAddress: string,
    takerAssetAddress: string,
    makerAmount: string,
    takerAmount: string,
    tradeToAddress: string,
    margin: number,
    nftUniqId: string
    orderStructs: any,
    fromSymbol: string,
    toSymbol: string,
    tradeInfo?: {
        nftOwner: string,
        isActive: boolean,
        isSuccessed: boolean,
        fromAsset: string,
        toAsset: string,
        deposited: string,
        depositedWithMargin: string,
        firstPrice: string,
        createdTimestamp: string
    }
}

const propositionsProvider = createProvider(() => {
    const {web3State} = useWeb3()
    const [propositions, setPropositions] = useState([] as Proposition[]);
    const [reloadRequest, setReloadRequest] = useState(true);

    useEffect(() => {
        (async () => {
            if (web3State === Web3State.CONNECTED && reloadRequest) {
                setReloadRequest(false)
                const resp = await fetch("/api/list")
                const json = await resp.json()
                setPropositions(json.propositions)
            }
        })()
    }, [web3State, reloadRequest]);

    return {propositions, setPropositions, requestReload: () => setReloadRequest(true)}
})

export const usePropositions = propositionsProvider.hook
export const PropositionsProvider = propositionsProvider.provider