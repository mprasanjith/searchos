import { BigNumber, ethers } from "ethers";
import {
  Chain,
  CHAIN_NAME,
  Wallet,
  Token,
  Param,
  Resolver,
  TOKEN_AMOUNT,
  TOKEN_NAME,
  WALLET_NAME,
} from "../../utils/types/task";
import { setupClient } from "@/utils/shared/wagmi";
import { fetchEnsAddress } from "@wagmi/core";
import { getAppBaseUrl } from "@/utils/server/url";
import { ChainData, TokenData } from "@/utils/types/data";

setupClient();

const resolvers: Resolver[] = [
  {
    name: "ResolveWalletAddress",
    params: {
      walletName: Param.WALLET_NAME,
      "chain?": Param.CHAIN,
    },
    returnValue: Param.WALLET,
    handler: async (walletName: WALLET_NAME, chain: Chain) => {
      if (String(walletName)?.endsWith(".eth")) {
        const address = await fetchEnsAddress({
          name: walletName,
          chainId: 1,
        });
        return { address, chain } as Wallet;
      }
      throw new Error("Unresolvable wallet");
    },
  },
  {
    name: "ResolveChain",
    params: { chainName: Param.CHAIN_NAME },
    returnValue: Param.CHAIN,
    handler: async (chainName: CHAIN_NAME) => {
      const response = await fetch(`${getAppBaseUrl()}/api/data/chains`);
      if (!response.ok) throw new Error("Error fetching chains list");

      const data: ChainData[] = await response.json();
      const chain = data.find(
        (chain) =>
          chain.chain?.toLowerCase()?.includes(chainName?.toLowerCase()) ||
          chain.name?.toLowerCase()?.includes(chainName?.toLowerCase())
      );

      return chain;
    },
  },
  {
    name: "ResolveTokenAddress",
    params: {
      tokenName: Param.TOKEN_NAME,
      "chain?": Param.CHAIN,
    },
    returnValue: Param.TOKEN,
    handler: async (tokenName: TOKEN_NAME, chain: Chain) => {
      const chainId = chain?.chain || "ethereum";
      const response = await fetch(
        `${getAppBaseUrl()}/api/data/tokens/search?q=${tokenName}&chain=${chainId}`
      );
      if (!response.ok) throw new Error("Error fetching token data");

      const data: TokenData = await response.json();
      return data;
    },
  },
  {
    name: "ParseTokenAmount",
    description: "Parse the token amount as a BigNumber from the user input.",
    params: {
      tokenAmount: Param.TOKEN_AMOUNT,
      token: Param.TOKEN,
    },
    returnValue: Param.TOKEN_AMOUNT_BN,
    handler: async (tokenAmount: TOKEN_AMOUNT, token: Token) => {
      try {
        const parsedAmount = ethers.utils.parseUnits(
          tokenAmount,
          token.decimals
        );
        console.log(tokenAmount, token, parsedAmount);

        return parsedAmount;
      } catch (error) {
        throw new Error("Error parsing token amount");
      }
    },
  },
];

export default resolvers;
