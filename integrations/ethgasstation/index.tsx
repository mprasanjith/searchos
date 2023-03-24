import { Command, Extension } from "@/sdk";
import icon from "./icon.png";
import GasPrice from "./GasPrice";
export class EthGasStationExtension extends Extension {
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
      params: [],
      shouldHandle: (query: string) => {
        return query.trim().toLowerCase().includes("gas");
      },
      url: "https://ethgasstation.info/",
      handler: ({ query }) => <GasPrice query={query} />,
    },
  ];

  async initialize() {}
}
