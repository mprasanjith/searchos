import { Command, Extension } from "@/sdk";
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
      title: (query) => `Get ${query?.toUpperCase()} token price`,
      description: "Get token prices via CoinGecko",
      url: (query) => {
        const token = this.client.findTokenMatch(query);
        return (
          `https://www.coingecko.com/en/coins/${token?.id}` ||
          "https://www.coingecko.com/"
        );
      },
      shouldHandle: (query: string) => !!this.client.findTokenMatch(query),
      handler: ({ query }) => <TokenPrice client={this.client} query={query} />,
    },
  ];

  async initialize() {
    if (this.isInitialized) return;
    await this.client.initialize();
  }
}
