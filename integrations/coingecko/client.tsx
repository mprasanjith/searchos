import { HTTP } from "@/sdk/helpers";

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

export class CoinGeckoClient {
  private http: HTTP = new HTTP();
  private tokenlist: CoinGeckoTokenResult[] | null = null;

  async initialize() {
    if (this.tokenlist) return;

    const tokens = await this.getTokenlist();
    this.tokenlist = tokens;
  }

  findTokenMatch(query: string) {
    return this.tokenlist?.find(
      (token) =>
        token.symbol?.toLowerCase().trim() === query.toLowerCase().trim()
    );
  }

  async getTokenlist() {
    return this.http.get<CoinGeckoTokenResult[]>(
      `/api/integrations/coingecko/tokenlist`
    );
  }

  async getPrice(tokenId: string) {
    return this.http.get<CoinGeckoPriceResult>(
      `/api/integrations/coingecko/price?id=${tokenId}`
    );
  }
}
