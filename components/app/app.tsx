import {Header} from "../header/header";
import * as React from "react";
import {useWeb3, Web3State} from "../providers/web3-provider";
import {Box, Button, Container} from "@mui/material";
import {AllPositions} from "./allpositions/allpositions";
import {MetamaskError} from "./metamask-error";
import {useRouter} from "next/router";

export const Application: React.FC = () => {
    const {web3State, netId, isError} = useWeb3()
    const router = useRouter()

    if (isError)
        return <MetamaskError/>

    return (
        <Container maxWidth={"md"}>
            <Header/>
            {web3State === Web3State.CONNECTED && <>
                <Button variant={"contained"} size={"large"} onClick={() => {router.push("/create")}}>
                    Предложить плечо
                </Button>
                <Box height={40}/>
                <AllPositions/>
            </>}
        </Container>
    )
}
