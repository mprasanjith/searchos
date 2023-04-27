import { BigNumber } from "ethers";
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
} from "../types";

const resolvers: Resolver[] = [
  {
    name: "ResolveWalletAddress",
    params: {
      walletName: Param.WALLET_NAME,
      "chain?": Param.CHAIN,
    },
    returnValue: Param.WALLET,
    handler: async (ensName: WALLET_NAME, chain: Chain) => {
      return { address: "0x1234", chain: 1 } as Wallet;
    },
  },
  {
    name: "ResolveChainId",
    params: { chainName: Param.CHAIN_NAME },
    returnValue: Param.CHAIN,
    handler: async (chainName: CHAIN_NAME) => {
      return 1 as Chain;
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
      return { address: "0x1234", chain } as Token;
    },
  },
  {
    name: "ParseTokenAmount",
    description: "Parse the token amount as a BigNumber from the user input.",
    params: {
      tokenAmount: Param.TOKEN_AMOUNT,
      token: Param.TOKEN,
      "chain?": Param.CHAIN,
    },
    returnValue: Param.TOKEN_AMOUNT_BN,
    handler: async (tokenAmount: TOKEN_AMOUNT, token: Token, chain: Chain) => {
      return BigNumber.from(1);
    },
  },
];

export default resolvers;
