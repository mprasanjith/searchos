import { Command, CommandType, Extension } from "@/sdk";
import icon from "./icon.png";
import GasPrice from "./GasPrice";

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

export class EthGasStationExtension extends Extension {
  name = "ethgasstation";
  title = "EthGasStation";
  description = "Ethereum gas prices.";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-gas-price",
      title: "Get Ethereum gas price",
      description: "Get gas prices for Ethereum mainnet from EthGasStation.",
      type: CommandType.Informational,
      shouldHandle: (query: string) => {
        return query.trim().toLowerCase().includes("gas")
      },
      handler: ({ query }) => <GasPrice query={query} />,
    }
  ];

  async initialize() {}
}
