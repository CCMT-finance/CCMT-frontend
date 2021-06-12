import * as React from "react";
import {useMemo} from "react";
import {networkName, useWeb3, Web3State} from "../providers/web3-provider";
import {Button, CircularProgress, Container, styled, Typography} from "@mui/material";

const Root = styled(Container)`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const MetamaskError: React.FC = () => {
    const {web3State, netId, reset} = useWeb3()

    const error = useMemo(() => {
        switch (web3State) {
            case Web3State.UNKNOWN:
                return "Please connect Metamask to proceed"
            case Web3State.LOADING:
                return "Please connect Metamask to proceed"
            case Web3State.CONNECTING:
                return "Please connect Metamask to proceed"
            case Web3State.BAD_NETWORK:
                return `Metamask is connected to unknown network: ${networkName(netId)}. Please select Kovan`
            case Web3State.LOCKED:
                return "Please unlock Metamask to proceed"
            case Web3State.NO_METAMASK:
                return "Please install Metamask to proceed"
            case Web3State.CONNECTED:
                return null
        }
    }, [web3State]);

    const showConnectButton = useMemo(() => {
        switch (web3State) {
            case Web3State.LOCKED:
                return true
            default:
                return false
        }
    }, [web3State]);

    if (web3State == Web3State.LOADING) {
        return <Root maxWidth={"md"}>
            <CircularProgress/>
        </Root>
    }

    return (
        <Root maxWidth={"md"}>
            <img alt={"MetaMask logo"} src={"https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"}
                 height={200}/>
            <Typography variant={"h6"}>
                {error}
            </Typography>
            {showConnectButton && <Button variant={"outlined"} onClick={() => reset()}>
                Connect metamask
            </Button>}
        </Root>
    )
}
