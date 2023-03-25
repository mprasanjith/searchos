import { Command, Extension } from "@/sdk";
import icon from "./icon.png";
import ERC20Transfer from "./ERC20Transfer";
import {
  sanitizeAddress,
  sanitizeAmount,
  sanitizeAmountBigNumber,
  sanitizeENS,
} from "@/sdk/helpers/sanitizers";
import { BigNumberish } from "ethers";
import { TokenListClient } from "@/sdk/helpers/tokens";

export interface ERC20TransferParams {
  token: string | null;
  sendAmount: string | null;
  receiverAddress: `0x${string}` | string | null;
}

export class ERC20TransferExtension extends Extension {
  private tokenListClient = new TokenListClient();

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
      handler: ({ assistantQuery }) => {
        const params: ERC20TransferParams = {
          token: null,
          sendAmount: null,
          receiverAddress: null,
        };
        if (assistantQuery) {
          const tokenSymbol = assistantQuery["token"];
          const token = this.tokenListClient.findTokenBySymbol(tokenSymbol);
          if (token) params.token = token.symbol;

          const amount = assistantQuery["sendAmount"];
          params.sendAmount = sanitizeAmount(amount);

          params.receiverAddress =
            sanitizeAddress(assistantQuery["receiverAddress"]) ||
            sanitizeENS(assistantQuery["receiverAddress"]);
        }

        return (
          <ERC20Transfer
            tokenList={this.tokenListClient.getTokenList()}
            params={params}
          />
        );
      },
      requireWallet: true,
    },
  ];

  async initialize() {
    await this.tokenListClient.initialize();
  }
}
