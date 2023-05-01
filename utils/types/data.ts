export interface ChainData {
  name: string;
  chain: string;
  chainId: number;
  icon: string;
  rpc: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  explorer: {
    name: string;
    url: string;
  }[];
}

export interface TokenData {
  address: string;
  chain: string;
  name: string;
  symbol: string;
  decimals: string;
  logoURI: string;
}
