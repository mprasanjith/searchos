import { Command, Extension, Skeleton } from "@/sdk";
import icon from "./icon.jpg";
import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import dynamic from "next/dynamic";
import { TokenListClient } from "@/sdk/helpers/tokens";
import { sanitizeAmount } from "@/sdk/helpers/sanitizers";

const widgetConfig: WidgetConfig = {
  disableI18n: true,
  disableTelemetry: true,
  integrator: "SearchOS",
  appearance: "light",
  hiddenUI: ["appearance", "poweredBy", "language", "toAddress"],
  containerStyle: {
    border: "none",
    borderRadius: "0",
  },
  theme: {
    palette: {
      primary: { main: "#373A40" },
      secondary: { main: "#373A40" },
    },
    typography: {
      fontFamily: `SFRounded, ui-rounded, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
      fontWeightBold: "400 !important",
      fontWeightMedium: "400 !important",
      fontWeightLight: "400 !important",
      fontWeightRegular: "400 !important",
    },
  },
};

const LiFiWidgetDynamic = dynamic(
  () => import("@lifi/widget").then((module) => module.LiFiWidget) as any,
  {
    ssr: false,
    loading: () => <Skeleton height="35rem" visible />,
  }
) as typeof LiFiWidget;

interface SwapParams {
  fromToken?: string;
  toToken?: string;
  fromAmount?: number;
  fromChain?: number;
  toChain?: number;
}

export class LiFiExtension extends Extension {
  private tokenListClient = new TokenListClient();

  name = "lifi";
  title = "LI.FI";
  description = "LI.FI is a cross-chain bridge aggregation protocol.";
  author = "SearchOS";
  icon = icon;

  async initialize() {
    await this.tokenListClient.initialize();
  }

  commands: Command[] = [
    {
      name: "swap-tokens",
      title: `Swap tokens`,
      description: "Swap tokens via LI.FI aggregator",
      assistant: {
        description: "Swap tokens",
        params: ["inToken", "outToken", "sendAmount"],
      },
      shouldHandle: (query: string) => {
        const wordsToHandle = ["swap", "exchange"];
        return wordsToHandle.some(
          (word) => query.trim().toLowerCase() === word
        );
      },
      handler: ({ assistantQuery, chainId }) => {
        const params: SwapParams = {
          fromChain: chainId,
          toChain: chainId,
        };

        if (assistantQuery) {
          const inTokenSymbol = assistantQuery["inToken"];
          const inToken = this.tokenListClient.findTokenBySymbol(inTokenSymbol, chainId);
          if (inToken) params.fromToken = inToken.address;

          const outTokenSymbol = assistantQuery["outToken"];
          const outToken =
            this.tokenListClient.findTokenBySymbol(outTokenSymbol, chainId);
          if (outToken) params.toToken = outToken.address;

          const sendAmount = sanitizeAmount(assistantQuery["sendAmount"]);
          if (sendAmount) params.fromAmount = Number.parseFloat(sendAmount);
        }

        return <LiFiWidgetDynamic config={{ ...widgetConfig, ...params }} />;
      },
    },
    {
      name: "bridge-tokens",
      title: `Bridge tokens`,
      description: "Bridge tokens via LI.FI aggregator",
      assistant: {
        description: "Swap tokens",
        params: ["inToken", "outToken", "sendAmount", "toChain"],
      },
      shouldHandle: (query: string) => {
        const wordsToHandle = [
          "bridge",
          "tokens",
          "erc20",
          "crosschain",
          "cross-chain",
        ];
        return wordsToHandle.some(
          (word) => query.trim().toLowerCase() === word
        );
      },
      handler: ({ assistantQuery, chainId }) => {
        const params: SwapParams = {
          fromChain: chainId,
        };

        if (assistantQuery) {
          const inTokenSymbol = assistantQuery["inToken"];
          const inToken = this.tokenListClient.findTokenBySymbol(inTokenSymbol, chainId);
          if (inToken) params.fromToken = inToken.address;

          const outTokenSymbol = assistantQuery["outToken"];
          const outToken =
            this.tokenListClient.findTokenBySymbol(outTokenSymbol, chainId);
          if (outToken) params.toToken = outToken.address;

          const sendAmount = sanitizeAmount(assistantQuery["sendAmount"]);
          if (sendAmount) params.fromAmount = Number.parseFloat(sendAmount);
        }

        return <LiFiWidgetDynamic config={{ ...widgetConfig, ...params }} />;
      },
    },
  ];
}
