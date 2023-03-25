import { Command, Extension } from "@/sdk";
import icon from "./icon.png";
import GasPrice from "./GasPrice";
import { EthGasStationClient } from "./client";
export class EthGasStationExtension extends Extension {
  private client = new EthGasStationClient();

  name = "ethgasstation";
  title = "EthGasStation";
  description = "Ethereum gas prices.";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-gas-price",
      title: "Get gas price",
      description: "Get gas prices from EthGasStation",
      assistant: {
        description: "Get gas prices",
        params: [],
      },
      shouldHandle: (query: string) => {
        return query.trim().toLowerCase().includes("gas");
      },
      url: "https://ethgasstation.info/",
      handler: ({ query }) => <GasPrice client={this.client} query={query} />,
    },
  ];

  async initialize() {}
}
