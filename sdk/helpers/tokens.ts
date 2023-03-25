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

const tokenListUrls: Record<number, string> = {
  1: "https://tokens.coingecko.com/uniswap/all.json",
  100: "https://tokens.honeyswap.org/",
  137: "https://tokens.honeyswap.org/",
};

export class TokenListClient {
  private http: HTTP = new HTTP();
  private tokenlists: Record<number, TokenListResult | null> | null = null;

  async initialize() {
    if (this.tokenlists) return;

    const tokensMainnet = await this.fetchTokenList(1);
    const tokensGC = await this.fetchTokenList(100);
    const tokensPolygon = await this.fetchTokenList(137);
    this.tokenlists = {
      1: tokensMainnet,
      100: tokensGC,
      137: tokensPolygon,
    };

    console.log("TokenListClient initialized", this.tokenlists);
  }

  getTokenList(chainId: number) {
    return this.tokenlists?.[chainId]?.tokens || [];
  }

  findTokenBySymbol(symbol: string, chainId: number) {
    if (!symbol) return null;

    let sanitizedSymbol = symbol.trim().toLowerCase();

    let token = this.getTokenList(chainId).find(
      (token) => token.symbol?.trim()?.toLowerCase() === sanitizedSymbol
    );

    if (!token) {
      if (sanitizedSymbol === "eth") {
        sanitizedSymbol = "weth";
      } else if (sanitizedSymbol === "weth") {
        sanitizedSymbol = "eth";
      }

      token = this.getTokenList(chainId).find(
        (token) => token.symbol?.trim()?.toLowerCase() === sanitizedSymbol
      );
    }

    return token;
  }

  async fetchTokenList(chainId: number) {
    if (!tokenListUrls[chainId]) return null;
    const tokenList = await this.http.get<TokenListResult>(
      tokenListUrls[chainId]
    );
    tokenList.tokens = tokenList.tokens.filter(
      (token) => token.chainId === chainId
    );

    return tokenList;
  }
}
