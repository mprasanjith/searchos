import { BigNumber } from "ethers";

export type WALLET_NAME = string;
export type TOKEN_NAME = string;
export type CHAIN_NAME = string;
export type ETH_ADDRESS = `0x${string}`;
export type ETH_TOKEN_ADDRESS = `0x${string}`;
export type CHAIN_ID = number;
export type TOKEN_AMOUNT = string;
export type TOKEN_AMOUNT_BN = BigNumber;

export type ParamType =
  | WALLET_NAME
  | TOKEN_NAME
  | CHAIN_NAME
  | ETH_ADDRESS
  | ETH_TOKEN_ADDRESS
  | CHAIN_ID
  | TOKEN_AMOUNT
  | TOKEN_AMOUNT_BN;

export enum Param {
  WALLET_NAME = "walletName",
  TOKEN_NAME = "tokenName",
  CHAIN_NAME = "chainName",
  ETH_ADDRESS = "ethAddress",
  ETH_TOKEN_ADDRESS = "ethTokenAddress",
  CHAIN_ID = "chainId",
  TOKEN_AMOUNT = "tokenAmount",
  TOKEN_AMOUNT_BN = "tokenAmountBN",
}

export interface Resolver {
  name: string;
  params: Param[];
  returnValue: Param;
  description?: string;
  handler: (...args: any[]) => Promise<any>;
}

export interface App {
  name: string;
  props: Record<string, Param>;
  description?: string;
  component: React.FC<any>;
}
