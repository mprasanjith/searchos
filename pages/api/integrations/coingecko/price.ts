import { CoinGeckoTokenDataResult } from "@/integrations/coingecko";
import { HTTP } from "@/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoinGeckoTokenDataResult>
) {
  if (!req.query.id || typeof req.query.id !== "string") {
    return res.status(400).end();
  }
  const http = new HTTP();
  const response = await http.get<CoinGeckoTokenDataResult>(
    `https://api.coingecko.com/api/v3/coins/${req.query.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  res.setHeader("Cache-Control", "max-age=0, s-maxage=120");

  res.json(response);
}
