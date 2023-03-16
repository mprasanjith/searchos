import { AppProps } from "next/app";
import Head from "next/head";
import { Box, ColorScheme, Container, MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const preferredColorScheme = useColorScheme();

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

      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Box bg={colorScheme == "light" ? "gray.1" : "dark.6"} h="100vh">
          <Component {...pageProps} />
        </Box>
      </MantineProvider>
    </>
  );
}
