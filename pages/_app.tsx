import { AppProps } from "next/app";
import Head from "next/head";
import { Box, ColorScheme, Container, MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const preferredColorScheme = useColorScheme();

  const colorScheme: ColorScheme = "light" || preferredColorScheme;

  const { chains, provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
  );
  const client = createClient({
    autoConnect: true,
    provider,
    webSocketProvider,
  });

  return (
    <>
      <Head>
        <title>SearchOS</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <WagmiConfig client={client}>
        <RainbowKitProvider
          chains={chains}
          theme={darkTheme({
            accentColor: "black",
          })}
          coolMode={true}
        >
          <MantineProvider
            theme={{ colorScheme }}
            withGlobalStyles
            withNormalizeCSS
          >
            <Box bg={colorScheme == "light" ? "gray.1" : "dark.6"} h="100vh">
              <Component {...pageProps} />
            </Box>
          </MantineProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
