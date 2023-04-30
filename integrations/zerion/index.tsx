import { Command, Extension } from "@/sdk";
import { ZerionClient } from "./client";
import icon from "./icon.jpg";
import UserProfile from "./UserProfile";
import { isAddress } from "ethers/lib/utils.js";
import { sanitizeAddress, sanitizeENS } from "@/sdk/helpers/sanitizers";


export class ZerionExtension extends Extension {
  private client: ZerionClient = new ZerionClient();

  name = "zerion";
  title = "Zerion";
  description =
    "Zerion provides a unified API bringing visibility to billions of Web3 data points.";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-wallet-balance",
      title: (query) => {
        if (["user", "profile", "user"].some((keyword) => query === keyword)) {
          return `Explore your user profile`;
        }

        const address = sanitizeAddress(query);
        if (address) {
          return `Explore ${address.slice(0, 6)}...${address.slice(-4)}`;
        }

        const ens = sanitizeENS(query);
        if (ens) return `Explore ${ens}`;

        return `Explore user profile`;
      },
      description: "Get your user profile via Zerion",
      assistant: {
        description: "Get user profile",
        params: ["userProfile"],
      },
      shouldHandle: (query: string) => {
        if (["user", "profile", "user profile"].some((keyword) => query === keyword)) {
          return true;
        }

        return (
          !query.includes(" ") &&
          (query.trim().endsWith(".eth") || isAddress(query.trim()))
        );
      },
      handler: ({ query, assistantQuery }) => {
        const normalizedQuery = query.trim().toLowerCase();

        const userProfile = ["user", "profile", "user profile"].some(
          (keyword) => normalizedQuery === keyword
        );

        let address: `0x${string}` | string | null = null;
        if (!userProfile) {
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
          <UserProfile
            client={this.client}
            addressOrEns={!userProfile ? address : null}
          />
        );
      },
    },
  ];

  async initialize() {}
}
