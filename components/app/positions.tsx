import * as React from "react";
import {useCallback, useMemo} from "react";
import {Avatar, Box, Button, Card, Grid, styled, Typography} from "@mui/material";
import {Proposition, usePropositions} from "../providers/propositions-provider";
import {logoUrl} from "../tools/tools";
import {useWeb3} from "../providers/web3-provider";
import {ABIOrder} from "../tools/1inch";
import {limitOrderProtocolAbi} from "../tools/abis/LimitOrderProtocol";
import {erc20Abi} from "../tools/abis/ERC20";
import {CCMTProvider} from "../tools/abis/CCMTProvider";
import {config} from "../config/config";

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

const PositionCard: React.FC<{ className?: string, proposition: Proposition }> = ({
                                                                                      className,
                                                                                      proposition,
                                                                                  }) => {
    const fromAssetIconAddress = logoUrl(proposition.fromSymbol)
    const toAssetIconAddress = logoUrl(proposition.toSymbol)

    const {requestReload} = usePropositions()

    const {web3, web3Account, isAdmin} = useWeb3()

    const closePosition = useCallback(() => {
            (async () => {
                if (!web3)
                    return

                const provider = new web3.eth.Contract(CCMTProvider, config.CCMTProviderAddress)
                await provider.methods.closeTrade(proposition.nftUniqId).send({from: web3Account});
                const tradeInfo = await provider.methods.getTradeInfo(proposition.nftUniqId).call();

                const formattedTradeInfo = {
                    isActive: tradeInfo[0],
                    fromAsset: tradeInfo[1],
                    toAsset: tradeInfo[2],
                    deposited: tradeInfo[3],
                    depositedWithMargin: tradeInfo[4],
                    firstPrice: tradeInfo[5],
                    createdTimestamp: tradeInfo[6],
                    nftOwner: web3Account
                }

                await fetch("/api/setdata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: proposition.id,
                        tradeInfo: formattedTradeInfo
                    })
                })
                requestReload()
            })()
        },
        [web3, web3Account, proposition, requestReload],
    );

    const submit = useCallback(() => {
            (async () => {
                if (!web3)
                    return
                const swap = new web3.eth.Contract(limitOrderProtocolAbi, "0x94Bc2a1C732BcAd7343B25af48385Fe76E08734f");
                const limitOrder = proposition.orderStructs.limitOrder
                const signature = web3.eth.abi.encodeParameter(ABIOrder, limitOrder);

                const takerAsset = new web3.eth.Contract(erc20Abi, proposition.takerAssetAddress)
                await (takerAsset.methods.approve(swap.options.address, proposition.takerAmount)).send({from: web3Account});
                await swap.methods.fillOrder(limitOrder, signature, web3.utils.toBN("0"), web3.utils.toBN(proposition.takerAmount), web3.utils.toBN('0')).send({from: web3Account});

                const provider = new web3.eth.Contract(CCMTProvider, config.CCMTProviderAddress)
                const tradeInfo = await provider.methods.getTradeInfo(proposition.nftUniqId).call();

                const formattedTradeInfo = {
                    isActive: tradeInfo[0],
                    fromAsset: tradeInfo[1],
                    toAsset: tradeInfo[2],
                    deposited: tradeInfo[3],
                    depositedWithMargin: tradeInfo[4],
                    firstPrice: tradeInfo[5],
                    createdTimestamp: tradeInfo[6],
                    nftOwner: web3Account
                }

                await fetch("/api/setdata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: proposition.id,
                        tradeInfo: formattedTradeInfo
                    })
                })
                requestReload()
            })()
        },
        [web3, web3Account, proposition, requestReload],
    );


    if (!web3)
        return <></>

    return <Grid item xs={12} lg={4}>
        <Card className={className} style={{borderRadius: 20, padding: 10, background: "#f1f7ff"}}>
            <Row2>
                <Row>
                    <Typography variant={"h6"}>
                        {web3.utils.fromWei(proposition.takerAmount)}
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
                    x{proposition.margin}
                </Typography>
            </Row2>
            <Box height={10}/>
            {!proposition.tradeInfo && <>
                <Button variant={"contained"} fullWidth={true} color={"secondary"} onClick={() => submit()}>
                    Использовать маржу
                </Button>
                <Box height={10}/>
            </>
            }
            {proposition.tradeInfo && proposition.tradeInfo.isActive && <>
                <Button variant={"contained"} fullWidth={true} color={"error"} onClick={() => closePosition()}>
                    Закрыть позицию
                </Button>
                <Box height={10}/>
            </>
            }
            {proposition.tradeInfo && !proposition.tradeInfo.isActive && <>
                <Button variant={"contained"} disabled={true} fullWidth={true} color={"error"} onClick={() => closePosition()}>
                    Позиция закрыта
                </Button>
                <Box height={10}/>
            </>
            }
            {isAdmin && <>
                <Box height={10}/>
                <Button variant={"contained"} fullWidth={true} color={"error"} onClick={async () => {
                    await fetch("/api/remove", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: proposition.id
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

export const Positions: React.FC = () => {
    const {isAdmin, web3Account} = useWeb3()
    const {propositions} = usePropositions()

    const myPropositions = useMemo(() => {
        return propositions.filter(proposition => proposition.tradeInfo && proposition.tradeInfo.nftOwner === web3Account)
    }, [propositions, web3Account])

    const openPropositions = useMemo(() => {
        return propositions.filter(proposition => !proposition.tradeInfo)
    }, [propositions, web3Account])

    return <div>
        {myPropositions.length !== 0 && <>
            <Typography variant={"h3"}>
                Мои CCMT-токены:
            </Typography>
            <Grid container spacing={2} style={{marginTop: 10}}>
                {myPropositions.map((proposition) => {
                    return <PositionCard proposition={proposition} key={proposition.id}/>
                })}
            </Grid>
        </>}
        <Box height={20}/>
        {openPropositions.length !== 0 && <>
            <Typography variant={"h3"}>
                Доступные плечи:
            </Typography>
            <Grid container spacing={2} style={{marginTop: 10}}>
                {openPropositions.map((proposition) => {
                    return <PositionCard proposition={proposition} key={proposition.id}/>
                })}
            </Grid>
        </>}
        {openPropositions.length === 0 && <Typography variant={"h3"}>
            Нет доступных плечей
        </Typography>}
    </div>
}