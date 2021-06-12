import type {AppProps} from 'next/app'
import {Web3Provider} from "../components/providers/web3-provider";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {CacheProvider, EmotionCache} from "@emotion/react";
import createEmotionCache from "../components/tools/createEmotionCache";
import theme from "../components/theme/theme";
import Head from "next/head";
import React from "react";
import {PropositionsProvider} from "../components/providers/propositions-provider";

const clientSideEmotionCache = createEmotionCache();

const App = (props: AppProps & { emotionCache: EmotionCache | undefined }) => {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

    return <>
        <Head>
            <title>CCMT</title>
            <link rel="icon" href="/favicon.ico"/>
            <meta name="viewport"
                  content="width=device-width, initial-scale=1"/>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
        </Head>
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
                <Web3Provider>
                    <PropositionsProvider>
                        <CssBaseline/>
                        <Component {...pageProps} />
                    </PropositionsProvider>
                </Web3Provider>
            </ThemeProvider>
        </CacheProvider>
    </>
}

export default App