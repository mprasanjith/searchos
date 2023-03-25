import { Command, Extension } from "@/sdk";
import { CovalentClient } from "./client";
import icon from "./icon.jpg";
import WalletBalance from "./WalletBalance";
import { isAddress } from "ethers/lib/utils.js";
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
        if (["balance", "wallet"].some((keyword) => query === keyword)) {
          return true;
        }

        return (
          !query.includes(" ") &&
          (query.trim().endsWith(".eth") || isAddress(query.trim()))
        );
      },
      handler: ({ query, assistantQuery }) => {
        const normalizedQuery = query.trim().toLowerCase();

        const ownBalance = ["balance", "wallet"].some(
          (keyword) => normalizedQuery === keyword
        );


        let address: `0x${string}` | string | null = null;
        if (!ownBalance) {
          const assistantNormalizedQuery = assistantQuery?.["walletAddress"]
            ?.trim()
            .toLowerCase();

          if (
            assistantNormalizedQuery &&
            (isAddress(assistantNormalizedQuery) ||
              assistantNormalizedQuery.endsWith(".eth"))
          ) {
            address = assistantNormalizedQuery;
          } else {
            address = normalizedQuery;
          }
        }

        return (
          <WalletBalance
            client={this.client}
            addressOrEns={!ownBalance ? address : null}
          />
        );
      },
    },
  ];

  async initialize() {}
}
