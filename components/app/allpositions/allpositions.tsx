import * as React from "react";
import {Avatar, Box, Button, Card, Grid, styled, Typography} from "@mui/material";
import {Proposition, usePropositions} from "../../providers/propositions-provider";
import {logoUrl} from "../../tools/tools";
import {useWeb3} from "../../providers/web3-provider";

const Row = styled('div')`
  display: flex;
  justify-content: start;
  gap: 10px;
  align-items: center;
`

const Row2 = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const PositionCard: React.FC<{ className?: string, proposition: Proposition, index: number }> = ({className, proposition, index}) => {
    const fromAssetIconAddress = logoUrl(proposition.fromSymbol)
    const toAssetIconAddress = logoUrl(proposition.toSymbol)

    const {requestReload} = usePropositions()

    const {web3, web3Account} = useWeb3()

    if (!web3)
        return <></>

    return <Grid item xs={12} md={6} lg={4}>
        <Card className={className} style={{borderRadius: 20, padding: 10, background: "#f1f7ff"}}>
            <Row2>
                <Row>
                    <Typography variant={"h6"}>
                        {web3.utils.fromWei(proposition.fromAmount)}
                    </Typography>
                    <Avatar
                        src={fromAssetIconAddress}/>
                    <Typography variant={"h6"}>
                        для покупки
                    </Typography>
                    <Avatar
                        src={toAssetIconAddress}/>
                </Row>
                <Typography variant={"h6"}>
                    x{proposition.coefficient}
                </Typography>
            </Row2>
            <Box height={10}/>
            <Button variant={"outlined"} fullWidth={true} color={"primary"}>
                Использовать маржу
            </Button>
            {web3Account === proposition.bankAddress && <>
                <Box height={10}/>
                <Button variant={"contained"} fullWidth={true} color={"error"} onClick={async () => {
                    await fetch("/api/remove", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            index
                        })
                    })
                    requestReload()
                }}>
                    Отменить
                </Button>
            </>
            }
        </Card>
    </Grid>
}

export const AllPositions: React.FC = () => {
    const {propositions} = usePropositions()

    return <div>
        <Typography variant={"h3"}>
            Доступные плечи
        </Typography>
        <Grid container spacing={2} style={{marginTop: 10}}>
            {propositions.map((proposition, index) => {
                return <PositionCard proposition={proposition} key={index} index={index}/>
            })}
        </Grid>
    </div>
}