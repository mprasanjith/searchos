import { CommandType, Extension, UserQuery } from "@/sdk";
import { HTTP } from "@/sdk/helpers";
import { FC } from "react";
import icon from "./icon.png";

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
  name = "coingecko";
  title = "CoinGecko";
  description = "Independently sourced crypto data powered by CoinGecko.";
  author = "SearchOS";
  icon = icon;

  private http: HTTP = new HTTP();
  private tokenlist: CoinGeckoTokenResult[] | null = null;

  commands = [
    {
      name: "get-price",
      title: "Get {query} token price",
      description: "Get token prices from CoinGecko.",
      type: CommandType.Informational,
      shouldHandle: (query: string) => !!this.findTokenMatch(query),
      handler: async (query: string) => {
        const match = this.findTokenMatch(query);
        if (!match) return "Error";

        const price = await this.getPrice(match.id);
        console.log(price);
        return `$${price.usd}`;
      },
    },
    {
      name: "get-price-history",
      title: "Get {query} token info",
      description: "Get token info from CoinGecko.",
      type: CommandType.Informational,
      shouldHandle: (query: string) => !!this.findTokenMatch(query),
      handler: async (query: string) => {
        return "Histroy " + query;
      },
    },
  ];

  async initialize() {
    if (this.tokenlist) return;

    const tokens = await this.getTokenlist();
    this.tokenlist = tokens;
  }

  private findTokenMatch(query: string) {
    return this.tokenlist?.find(
      (token) =>
        token.symbol?.toLowerCase().trim() === query.toLowerCase().trim()
    );
  }

  private async getTokenlist() {
    return this.http.get<CoinGeckoTokenResult[]>(
      `/api/integrations/coingecko/tokenlist`
    );
  }

  private async getPrice(tokenId: string) {
    return this.http.get<CoinGeckoPriceResult>(
      `/api/integrations/coingecko/price?id=${tokenId}`
    );
  }
}
