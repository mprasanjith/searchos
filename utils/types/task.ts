import { BigNumber } from "ethers";
import { ChainData } from "./data";

export type WALLET_NAME = string;
export type TOKEN_NAME = string;
export type CHAIN_NAME = string;
export type TOKEN_AMOUNT = string;

export type Chain = ChainData;
export type Wallet = { chain: Chain; address: `0x${string}` };
export type Token = { chain: Chain; address: `0x${string}` };
export type TokenAmount = { chain: Chain; token: Token; amount: BigNumber };

export type ParamType =
  | WALLET_NAME
  | TOKEN_NAME
  | CHAIN_NAME
  | TOKEN_AMOUNT
  | Wallet
  | Token
  | Chain
  | TokenAmount;

export enum Param {
  // Unparsed
  WALLET_NAME = "WalletNameString",
  TOKEN_NAME = "TokenNameString",
  CHAIN_NAME = "ChainNameString",
  TOKEN_AMOUNT = "TokenAmountString",

  // Parsed
  WALLET = "WalletAddress",
  TOKEN = "TokenReference",
  CHAIN = "ChainReference",
  TOKEN_AMOUNT_BN = "TokenAmount",
}

export interface Resolver {
  name: string;
  params: Record<string, Param>;
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

export interface Task {
  id: number;
  task: string;
  args: Record<string, string>;
}