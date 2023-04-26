import { BigNumber } from "ethers";
import { CHAIN_ID, CHAIN_NAME, ETH_ADDRESS, ETH_TOKEN_ADDRESS, Param, Resolver, TOKEN_AMOUNT, TOKEN_NAME, WALLET_NAME } from "../types";

const resolvers: Resolver[] = [
  {
    name: "ResolveWalletAddress",
    params: [Param.WALLET_NAME],
    returnValue: Param.ETH_ADDRESS,
    handler: async (ensName: WALLET_NAME) => {
      return "0x1234" as ETH_ADDRESS;
    },
  },
  {
    name: "ResolveChainId",
    params: [Param.CHAIN_NAME],
    returnValue: Param.CHAIN_ID,
    handler: async (chainName: CHAIN_NAME) => {
      return 1 as CHAIN_ID;
    },
  },
  {
    name: "ResolveTokenAddress",
    params: [Param.TOKEN_NAME, Param.CHAIN_ID],
    returnValue: Param.ETH_TOKEN_ADDRESS,
    handler: async (tokenName: TOKEN_NAME, chainId: CHAIN_ID) => {
      return "0x1234" as ETH_TOKEN_ADDRESS;
    },
  },
  {
    name: "ParseTokenAmount",
    params: [Param.ETH_TOKEN_ADDRESS, Param.CHAIN_ID, Param.TOKEN_AMOUNT],
    returnValue: Param.TOKEN_AMOUNT_BN,
    handler: async (tokenName: TOKEN_NAME, chainId: CHAIN_ID, tokenAmount: TOKEN_AMOUNT) => {
      return BigNumber.from(1);
    },
  },
];

export default resolvers;
