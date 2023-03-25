import { Command, Extension } from "@/sdk";
import { CovalentClient } from "./client";
import icon from "./icon.png";
import WalletBalance from "./WalletBalance";
import { isAddress } from "ethers/lib/utils.js";
import { match } from "./keywords"
export class CovalentExtension extends Extension {
  private client: CovalentClient = new CovalentClient();

  name = "covalent";
  title = "Covalent";
  description =
    "Covalent provides a unified API bringing visibility to billions of Web3 data points.";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-wallet-balance",
      title: `Get wallet balance`,
      description: "Get wallet balance via Covalent",
      assistant: {
        description: "Get wallet balance",
        params: ["walletAddress"],
      },
      shouldHandle: (query: string) => {
        const ownWallet = match(query);
        return query.includes(".eth") || isAddress(query) || ownWallet;
      },
      handler: ({ query }) => {
        const normalizedQuery = query.trim().toLowerCase() as `0x${string}`;
        return <WalletBalance client={this.client} query={normalizedQuery} />;
      },
    },
  ];

  async initialize() {}
}
