import { Command, Extension } from "@/sdk";
import icon from "./icon.png";
import ERC20Transfer from "./ERC20Transfer";

export class ERC20TransferExtension extends Extension {
  name = "erc20transfer";
  title = "Token Transfer";
  description = "Send ERC20 tokens";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "transfer-erc20",
      title: "Send tokens",
      description: "Transfer ERC20 tokens",
      assistant: {
        description: "Send tokens",
        params: ["token", "sendAmount", "receiverAddress"],
      },
      shouldHandle: (query: string) => {
        const matchedKeyword = ["send", "transfer"].find((keyword) =>
          query.trim().toLowerCase().includes(keyword)
        );
        return !!matchedKeyword;
      },
      handler: ({ query }) => <ERC20Transfer query={query} />,
      requireWallet: true,
    },
  ];

  async initialize() {}
}
