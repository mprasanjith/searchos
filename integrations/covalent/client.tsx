import { HTTP } from "@/sdk/helpers";
import { useNetwork } from "wagmi";

export type CovalentResponse = {
  data: {
    address: string;
    chain_id: number;
    chain_name: string;
    items: CovalentWalletBalanceResult[];
  }
  error: boolean;
  error_message: string;
  error_code: number;
}

export type CovalentWalletBalanceResult = {
  contract_decimals: number;
  contract_name: string;
  contract_ticker_symbol: string;
  contract_address: string;
  supports_erc: any;
  logo_url: string;
  last_transferred_at: any;
  native_token: boolean;
  type: string;
  balance: string;
  balance_24h: string;
  quote_rate: number;
  quote_rate_24h: number;
  quote: number;
  quote_24h: number;
  nft_data: any;
};

const COVALENT_CHAIN_NAME_MAP: Record<number, string> = {
  1: "eth-mainnet",
  10: "optimism-mainnet",
  137: "matic-mainnet",
};

export class CovalentClient {
  private http: HTTP = new HTTP();

  getChainName(chainId: number | undefined | null) {
    if(!chainId) return null
    return COVALENT_CHAIN_NAME_MAP[chainId];
  }

  async getWalletBalance({
    chainName,
    address,
  }: {
    chainName: string | null;
    address: `0x${string}` | undefined;
  }) {
    const url = `https://api.covalenthq.com/v1/${chainName}/address/${address}/balances_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
    const result = await this.http.get<CovalentResponse>(url) 
    return result.data.items
  }
}
