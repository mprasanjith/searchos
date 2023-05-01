import { App, Param, Token, TokenAmount, Wallet } from "@/utils/types/task";
import { BigNumber } from "ethers";
import useSWR from "swr";

interface TokenTransferProps {
  token?: Token;
  amount?: TokenAmount;
  receiver?: Wallet;
}

const TokenTransfer: React.FC<TokenTransferProps> = ({
  token,
  amount,
  receiver,
}) => {
  return <div>Token Transfer</div>;
};

const handler: App = {
  name: "TokenTransfer",
  props: {
    "token?": Param.TOKEN,
    "amount?": Param.TOKEN_AMOUNT_BN,
    "receiver?": Param.WALLET,
  },
  description: "Transfer tokens to another address",
  component: TokenTransfer,
};

export default handler;
