import { HTTP } from "@/sdk/helpers";
import { CoinGeckoTokenDataResult, CoinGeckoTokenResult } from ".";

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

  async getTokenData(tokenId: string) {
    return this.http.get<CoinGeckoTokenDataResult>(
      `/api/integrations/coingecko/price?id=${tokenId}`
    );
  }
}
