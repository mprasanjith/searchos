import { AppProps } from "next/app";
import Head from "next/head";
import { Box, ColorScheme, MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import {
  RainbowKitProvider,
  getDefaultWallets,
  lightTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "@rainbow-me/rainbowkit/wallets";
import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  Chain,
} from "wagmi";
import { gnosis, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import ExtensionsProvider from "@/components/ExtensionsProvider";
import "../styles/global.css";
import { Footer } from "../components/Footer";
import { createStyles } from "@mantine/core";


const useStyles = createStyles(() => ({
  footer: {
    position: "fixed",
    bottom: 0,
    marginBottom: "-20px",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

const defaultChains: any[] = [
  mainnet,
  polygon,
  {
    ...gnosis,
    iconUrl: "/gno.jpeg",
  },
];

const { chains, provider, webSocketProvider } = configureChains(
  defaultChains,
  process.env.NEXT_PUBLIC_ALCHEMY_ID
    ? [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
        publicProvider(),
      ]
    : [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "SearchOS",
  chains,
});
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors,
});

const RoundedFont = `SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`;

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const { classes  } = useStyles();

  const preferredColorScheme = useColorScheme();

  // TOOD: Implement dark theme
  const colorScheme: ColorScheme = "light" || preferredColorScheme;

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
          theme={lightTheme({
            accentColor: "black",
          })}
          coolMode={true}
        >
          <MantineProvider
            theme={{
              colorScheme,
              headings: { fontFamily: RoundedFont },
              fontFamily: `SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
            }}
            withGlobalStyles
            withNormalizeCSS
          >
            <ExtensionsProvider>
              <Box bg={colorScheme == "light" ? "gray.1" : "dark.6"} h="100vh">
                <Component {...pageProps} />
                <Footer className={classes.footer}/>
              </Box>

            </ExtensionsProvider>
          </MantineProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
