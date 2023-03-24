import {
  CoinGeckoExtension,
  CoinGeckoTokenDataResult,
} from "@/integrations/coingecko";
import { CovalentExtension } from "@/integrations/covalent";
import { ERC20TransferExtension } from "@/integrations/erc20transfer";
import { EthGasStationExtension } from "@/integrations/ethgasstation";
import { LiFiExtension } from "@/integrations/lifi";
import { buildSystemMessage, getChatCompletion } from "@/utils/server/openai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const systemMessage = buildSystemMessage([
    new ERC20TransferExtension(),
    new LiFiExtension(),
    new CoinGeckoExtension(),
    new EthGasStationExtension(),
    new CovalentExtension(),
  ]);
  const completion = await getChatCompletion(
    systemMessage,
    req.query.query as string
  );
  res.setHeader("Cache-Control", "max-age=0, s-maxage=120");
  res.json(completion);
}
