import { Command, Extension } from "@/sdk";
import { CoinGeckoClient } from "./client";
import icon from "./icon.png";
import TokenPrice from "./TokenPrice";

export interface CoinGeckoTokenResult {
  id: string;
  symbol: string;
  name: string;
}

export interface CoinGeckoTokenDataResult {
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    fully_diluted_valuation: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_percentage_24h: number;
    market_cap_change_percentage_24h: number;
  };
  image: {
    small: string;
    large: string;
  };
  market_cap_rank: number;
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
      assistant: {
        description: "Get token price",
        params: ["tokenSymbol"],
      },
      url: (query) => {
        const token = this.client.findTokenMatch(query);
        return `https://www.coingecko.com/en/coins/${token?.id}`;
      },
      shouldHandle: (query: string) => !!this.client.findTokenMatch(query),
      handler: ({ query, assistantQuery }) => {
        const params = assistantQuery?.["tokenSymbol"] || query;

        const token = this.client.findTokenMatch(params);
        if (!token) return null;

        return <TokenPrice client={this.client} token={token} />;
      },
    },
  ];

  async initialize() {
    if (this.isInitialized) return;
    await this.client.initialize();
  }
}
