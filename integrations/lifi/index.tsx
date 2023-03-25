import { Command, Extension, Skeleton } from "@/sdk";
import icon from "./icon.png";
import { LiFiWidget, WidgetConfig } from "@lifi/widget";
import dynamic from "next/dynamic";

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

export class LiFiExtension extends Extension {
  name = "lifi";
  title = "LI.FI";
  description = "LI.FI is a cross-chain bridge aggregation protocol.";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "swap-tokens",
      title: `Swap tokens`,
      description: "Swap tokens via LI.FI aggregator",
      assistant: {
        description: "Swap tokens",
        params: ["inToken", "outToken", "sendAmount", "receiveAmount"],
      },
      shouldHandle: (query: string) => {
        const wordsToHandle = ["swap", "tokens", "exchange", "erc20", "dex"];
        return wordsToHandle.some((word) => query.includes(word));
      },
      handler: ({}) => <LiFiWidgetDynamic config={widgetConfig} />,
    },
    {
      name: "bridge-tokens",
      title: `Bridge tokens`,
      description: "Bridge tokens via LI.FI aggregator",
      assistant: {
        description: "Swap tokens",
        params: [
          "inToken",
          "outToken",
          "sendAmount",
          "receiveAmount",
          "fromChain",
          "toChain",
        ],
      },
      shouldHandle: (query: string) => {
        const wordsToHandle = [
          "bridge",
          "tokens",
          "erc20",
          "crosschain",
          "cross-chain",
        ];
        return wordsToHandle.some((word) => query.includes(word));
      },
      handler: ({}) => <LiFiWidgetDynamic config={widgetConfig} />,
    },
  ];
}
