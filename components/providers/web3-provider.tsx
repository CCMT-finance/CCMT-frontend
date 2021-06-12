import * as React from "react";
import {useCallback, useEffect, useMemo, useState} from "react";
import Web3 from "web3";
import {createProvider} from "../tools/react-provider";

const NO_METAMASK_ERROR = "NoMetamaskError";
const LOCKED_METAMASK_ERROR = "LockedMetamaskError";

export enum Web3State {
    UNKNOWN,
    LOADING,
    CONNECTING,
    BAD_NETWORK,
    NO_METAMASK,
    CONNECTED,
    LOCKED,
    REQUESTED,
}

export const networkName = (networkId: number) => {
    switch (networkId) {
        case 1:
            return "Mainnet"
        case 3:
            return "Ropsten"
        case 4:
            return "Rinkeby"
        case 5:
            return "Goerli"
        case 42:
            return "Kovan"
        default:
            return "Unknown"
    }
}


const getWeb3 = async () => {
    // @ts-ignore
    const we = window.ethereum;
    if (we) {
        we.autoRefreshOnNetworkChange = false;
        try {
            await we.enable();
        } catch (e) {
            throw new Error(LOCKED_METAMASK_ERROR);
        }
        return new Web3(we);
    } else { // @ts-ignore
        if (window.web3) { // @ts-ignore
            return new Web3(window.web3);
        } else
            throw new Error(NO_METAMASK_ERROR);
    }
};

const web3Provider = createProvider(() => {
    const [web3, setWeb3] = useState(undefined as Web3 | undefined);
    const [web3State, setWeb3State] = useState(Web3State.REQUESTED);
    const [web3Account, setWeb3Account] = useState("");
    const [netId, setNetId] = useState(-1);

    const reset = useCallback(
        () => {
            setWeb3(undefined)
            setWeb3State(Web3State.REQUESTED)
            setWeb3Account("")
            setNetId(-1)
        },
        [],
    );

    useEffect(() => {
        if (web3State == Web3State.REQUESTED)
            setWeb3State(Web3State.LOADING)
    }, [web3State]);


    useEffect(() => {
        (async () => {
            if (web3State == Web3State.LOADING)
                try {
                    const web3 = await getWeb3();
                    const accounts = await web3.eth.getAccounts();
                    const netId = await web3.eth.net.getId();

                    if (netId != 42) {
                        setWeb3State(Web3State.BAD_NETWORK)
                    } else {
                        setWeb3(web3)
                        setWeb3Account(accounts[0])
                        setNetId(netId)
                        setWeb3State(Web3State.CONNECTED)

                        // @ts-ignore
                        if (window.ethereum) {
                            // @ts-ignore
                            window.ethereum.on('chainChanged', async () => {
                                reset()
                            });
                        }
                    }
                } catch (e: any) {
                    if (e.message === NO_METAMASK_ERROR) {
                        setWeb3State(Web3State.NO_METAMASK)
                    } else if (e.message === LOCKED_METAMASK_ERROR) {
                        setWeb3State(Web3State.NO_METAMASK)
                    } else {
                        console.error(e);
                    }
                }
        })()
    }, [web3State])

    const isError = useMemo(() => {
        switch (web3State) {
            case Web3State.LOCKED:
            case Web3State.NO_METAMASK:
            case Web3State.BAD_NETWORK:
            case Web3State.LOADING:
                return true
            default:
                return false
        }
    }, [web3State]);

    return {
        web3, setWeb3,
        web3State, setWeb3State,
        web3Account, setWeb3Account,
        netId, setNetId,
        reset, isError
    }
})

export const useWeb3 = web3Provider.hook
export const Web3Provider = web3Provider.provider