import { HTTP } from "@/sdk/helpers";
import { useAccount, useNetwork } from "wagmi";

export interface CovalentWalletBalanceResult {
  id: string;
  symbol: string;
  name: string;
}

export class CovalentClient {
  private http: HTTP = new HTTP();

  async initialize() {}

  getWalletAddress() {
    return function () {
      const { address } = useAccount();
      return address;
    }
  }

  getChainName() {
    return function () {
        const { chain } = useNetwork();
        return chain?.name;
    }
  }

  async getWalletBalance() {
    const walletAddress = this.getWalletAddress();
    const chainName = this.getChainName();
    return this.http.get<CovalentWalletBalanceResult>(
      `/api.covalenthq.com/v1/https://api.covalenthq.com/v1/${chainName}/address/${walletAddress}/balances_v2//?key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`
    );
  }
}
