import { createClient, configureChains, mainnet } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
);

export const setupClient = () => {
  createClient({
    provider,
    webSocketProvider,
  });
};
