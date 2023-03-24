import { Command, Extension } from "@/sdk";
import { CovalentClient } from "./client";
import icon from "./icon.png";
import WalletBalance from "./WalletBalance";

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
      url: "api.covalenthq.com/",
      shouldHandle: (query: string) => {
        const wordsToHandle = ["wallet", "balance"];
        return wordsToHandle.some((word) => query.includes(word));
      },
      handler: ({ query }) => (
        <WalletBalance client={this.client} query={query} />
      ),
    },
  ];

  async initialize() {}
}
