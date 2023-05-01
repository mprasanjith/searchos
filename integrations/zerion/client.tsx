import { HTTP } from "@/sdk/helpers";
import { WalletPortfolioResponse, WalletTransactionsResponse } from "./types";

export class ZerionClient {
  private http: HTTP = new HTTP();

  async getWalletBalance({
    address,
  }: {
    address: `0x${string}` | undefined;
  }) {
    const url = `/api/integrations/zerion/walletBalance?address=${address}`;
    const result: WalletPortfolioResponse = await this.http.get(url);
    return result.data.attributes.total.positions;
  }

  async getWalletTransactions({
    address
  }: {
    address: `0x${string}` | undefined;
  })
  {
    const url = `/api/integrations/zerion/transactions?address=${address}`;
    const result: WalletTransactionsResponse = await this.http.get(url);
    return result.data;
  }
}
