import { Command, Extension, ParamType } from "@/sdk";
import { HTTP } from "@/sdk/helpers";
import { CoinGeckoClient } from "./client";
import icon from "./icon.png";
import TokenPrice from "./TokenPrice";

export interface CoinGeckoTokenResult {
  id: string;
  symbol: string;
  name: string;
}

export interface CoinGeckoPriceResult {
  usd: number;
  usd_market_cap: number;
  usd_24h_vol: number;
  usd_24h_change: number;
  last_updated_at: number;
}

export class CoinGeckoExtension extends Extension {
  private isInitialized: boolean = false;
  private client: CoinGeckoClient = new CoinGeckoClient();

  name = "coingecko";
  title = "CoinGecko";
  description = "Independently sourced crypto data powered by CoinGecko.";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-price",
      title: ({ values }) => `Get ${values?.token?.toUpperCase()} token price`,
      description: "Get token prices from CoinGecko.",
      params: [{ name: "token", type: ParamType.Text }],
      intents: [
        "{token}",
        "{token} token",
        "{token} price",
        "get {token} price",
        "get {token} token price",
        "get price of {token}",
      ],
      shouldHandle: ({ values }) =>
        !!this.client.findTokenMatch(values?.["token"]),
      handler: ({ values }) => (
        <TokenPrice client={this.client} query={values?.["token"]} />
      ),
    },
  ];

  async initialize() {
    if (this.isInitialized) return;
    await this.client.initialize();
  }
}
