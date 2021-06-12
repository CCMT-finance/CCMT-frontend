import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useWeb3} from "../providers/web3-provider";
import {
    Avatar,
    Button,
    Card,
    CircularProgress,
    Container,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    styled,
    TextField,
    Typography
} from "@mui/material";
import {MetamaskError} from "./metamask-error";
import {logoUrl} from "../tools/tools";
import {useRouter} from "next/router";
import {submitOrder} from "../tools/1inch";
import {usePropositions} from "../providers/propositions-provider";
import {CCMTProvider} from "../tools/abis/CCMTProvider";
import Web3 from "web3";

const Root = styled(Container)`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`

const StyledCard = styled(Card)`
  width: 100%;
`

const Row = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`

const StyledAvatar = styled(Avatar)`
  margin-right: 12px;
`

const FullHeightTextField = styled(TextField)`
  height: 100%;
`

const StyledSelect = styled(Select)`
  margin-left: 8px;
`

type Token = {
    "chainId": number,
    "address": string,
    "name": string,
    "symbol": string,
    "decimals": number,
    "logoURI": string
}

const addressToBytes = (web3: Web3, address: string) => web3.utils.hexToBytes(web3.utils.padLeft(address, 64));
const bytesToAddress = (web3: Web3, bytes: number[]) => "0x" + web3.utils.bytesToHex(bytes).slice(26)

export const Create: React.FC = () => {
    const {web3, netId, isError, web3Account} = useWeb3()
    const {requestReload} = usePropositions()

    if (isError || !web3)
        return <MetamaskError/>

    const [tokens, setTokens] = useState([] as Token[]);
    const [selectedFromTokenIndex, setSelectedFromTokenIndex] = useState(0);
    const [selectedToTokenIndex, setSelectedToTokenIndex] = useState(1);

    const [fromAmount, setFromAmount] = useState("");
    const [coefficient, setCoefficient] = useState("");

    const router = useRouter()

    const post = useCallback(() => {
            (async () => {
                const selectedFromToken = tokens[selectedFromTokenIndex]
                const selectedToToken = tokens[selectedToTokenIndex]

                // SHIT below
                console.log(selectedFromToken.address)
                const bytes32 = addressToBytes(web3, selectedFromToken.address)
                console.log(bytes32)
                const ret = bytesToAddress(web3, bytes32)
                console.log(ret)

                const CCMTProviderAddress = "0x02de38b5a684891e982de5179e32c99bdf8f969d"
                const provider = new web3.eth.Contract(CCMTProvider, CCMTProviderAddress)
                const nftToken = await provider.methods.ccmtToken().send({from: web3Account});

                const orderStructs = await submitOrder(
                    web3,
                    netId,
                    "0x94Bc2a1C732BcAd7343B25af48385Fe76E08734f", // LimitOrderProtocol in Kovan
                    CCMTProviderAddress, // Our CCMTProvider in Kovan
                    nftToken,
                    selectedFromToken.address,
                    "1", // Give only ONE nft
                    web3.utils.toWei(fromAmount),
                    selectedToToken.address,
                    Number(coefficient)
                )

                await fetch("/api/add", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fromAddress: selectedFromToken.address,
                        fromAmount: web3.utils.toWei(fromAmount),
                        fromSymbol: selectedFromToken.symbol,
                        bankAddress: web3Account,
                        toAddress: selectedToToken.address,
                        toSymbol: selectedToToken.symbol,
                        coefficient: Number(coefficient),
                        orderStructs
                    })
                })
                requestReload()
                await router.push("/")
            })()
        },
        [tokens, selectedFromTokenIndex, setSelectedToTokenIndex, fromAmount, coefficient, router],
    );


    useEffect(() => {
        (async () => {
            const resp = await fetch("https://tokens.uniswap.org/")
            const json = await resp.json()

            const kovanTokens = json.tokens.filter((token: Token) => token.chainId === 42)
            setTokens([...kovanTokens, {
                address: "0x07de306FF27a2B630B1141956844eB1552B956B5",
                symbol: "USDT",
                name: "Tether USD",
                chainId: 42,
                decimals: 18,
                logoURI: logoUrl("USDT")
            }])
        })()
    }, []);

    if (tokens.length === 0)
        return <Root maxWidth={"md"}>
            <CircularProgress/>
        </Root>

    return (
        <Root maxWidth={"xs"}>
            <StyledCard>
                <Typography variant={"h5"}>
                    Предложить плечо
                </Typography>
                <Row>
                    <FullHeightTextField placeholder={"0.0"} value={fromAmount} fullWidth={true}
                                         onChange={(e) => setFromAmount(e.target.value)}/>
                    <StyledSelect
                        value={selectedFromTokenIndex}
                        onChange={(e) => {
                            setSelectedFromTokenIndex(Number(e.target.value))
                        }}
                        input={<OutlinedInput placeholder={"Выберите токен"}/>}
                        renderValue={() => <StyledAvatar
                            src={selectedFromTokenIndex === -1 ? "" : logoUrl(tokens[selectedFromTokenIndex].symbol)}/>}

                        // renderValue={(selected) => selected.join(', ')}
                        // MenuProps={MenuProps}
                    >
                        {tokens.map((token, tokenIndex) => {
                            return (
                                <MenuItem key={token.name} value={tokenIndex}>
                                    <StyledAvatar
                                        src={logoUrl(token.symbol)}/>
                                    <ListItemText primary={token.name}/>
                                </MenuItem>
                            );
                        })}
                    </StyledSelect>
                </Row>
                <Row>
                    <Typography>
                        Для торговли с:
                    </Typography>
                    <StyledSelect
                        value={selectedToTokenIndex}
                        onChange={(e) => {
                            setSelectedToTokenIndex(Number(e.target.value))
                        }}
                        input={<OutlinedInput placeholder={"Выберите токен"}/>}
                        renderValue={() => <StyledAvatar
                            src={selectedToTokenIndex === -1 ? "" : logoUrl(tokens[selectedToTokenIndex].symbol)}/>}

                        // renderValue={(selected) => selected.join(', ')}
                        // MenuProps={MenuProps}
                    >
                        {tokens.map((token, tokenIndex) => {
                            return (
                                <MenuItem key={token.name} value={tokenIndex}>
                                    <StyledAvatar
                                        src={logoUrl(token.symbol)}/>
                                    <ListItemText primary={`${token.symbol} (${token.name})`}/>
                                </MenuItem>
                            );
                        })}
                    </StyledSelect>
                </Row>
                <Row>
                    <FullHeightTextField placeholder={"Коэффициент"} value={coefficient} fullWidth={true}
                                         onChange={(e) => setCoefficient(e.target.value)}/>
                </Row>
                <Row>
                    <Button fullWidth variant={"contained"} onClick={() => post()}>
                        Разместить предложение
                    </Button>
                </Row>
            </StyledCard>
        </Root>
    )
}
