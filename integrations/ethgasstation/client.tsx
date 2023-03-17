import { HTTP } from "@/sdk/helpers";

export interface EthGasStationResult {
    "fast": number,
    "fastest": number,
    "safeLow": number,
    "average": number,
    "safeLowWait": number,
    "avgWait": number,
    "fastWait": number,
    "fastestWait": number,
}

export class EthGasStationClient {
  private http: HTTP = new HTTP();

  async getGasPrice() {
    return this.http.get<EthGasStationResult>(
      `https://ethgasstation.info/api/ethgasAPI.json`
    );
  }
}
