import * as React from "react";
import {networkName, useWeb3, Web3State} from "../providers/web3-provider";
import {Button, Container, Typography} from "@mui/material";

export const Header: React.FC = () => {
    const {web3State, web3Account, netId, reset} = useWeb3()

    return (
        <>
            <div>
                <Typography variant={"h1"}>
                    CCMT-finance
                </Typography>
            </div>
            {web3State == Web3State.UNKNOWN && <Button variant={"contained"} onClick={() => reset()}>
                Войти с помощью MetaMask
            </Button>}
        </>
    )
}
