import * as React from "react";
import {useEffect, useState} from "react";
import {createProvider} from "../tools/react-provider";
import {useWeb3, Web3State} from "./web3-provider";

export type Proposition = {
    fromAddress: string,
    fromAmount: string,
    fromSymbol: string,
    toAddress: string,
    toSymbol: string,
    bankAddress: string,
    coefficient: number,
    orderStructs: any
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