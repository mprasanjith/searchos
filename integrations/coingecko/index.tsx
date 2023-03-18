import { Command, CommandType, Extension } from "@/sdk";
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
      title: "Get {query} token price",
      description: "Get token prices from CoinGecko.",
      shouldHandle: (query: string) => !!this.client.findTokenMatch(query),
      handler: ({ query }) => <TokenPrice client={this.client} query={query} />,
    },
    {
      name: "get-price-history",
      title: "Get {query} token info",
      description: "Get token info from CoinGecko.",
      shouldHandle: (query: string) => false,
      handler: ({ query }) => {
        return <div>{query}</div>;
      },
    },
  ];

  async initialize() {
    if (this.isInitialized) return;
    await this.client.initialize();
  }
}
