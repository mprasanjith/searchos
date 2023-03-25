import { HTTP } from "@/sdk/helpers";

export interface TokenListToken {
  address: `0x${string}`;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

interface TokenListResult {
  tokens: TokenListToken[];
}

export class TokenListClient {
  private http: HTTP = new HTTP();
  private tokenlist: TokenListResult | null = null;

  async initialize() {
    if (this.tokenlist) return;

    const tokens = await this.getTokenlist();
    this.tokenlist = tokens;
  }

  getTokenList() {
    return this.tokenlist?.tokens || [];
  }

  findTokenBySymbol(symbol: string) {
    if (!symbol) return null;
    
    let sanitizedSymbol = symbol.trim().toLowerCase();
    if (sanitizedSymbol === "eth") sanitizedSymbol = "weth";

    return this.tokenlist?.tokens.find(
      (token) => token.symbol?.trim()?.toLowerCase() === sanitizedSymbol
    );
  }

  async getTokenlist() {
    return this.http.get<TokenListResult>(`https://tokens.1inch.eth.limo`);
  }
}
