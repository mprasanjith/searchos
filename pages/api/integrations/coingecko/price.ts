import {
  CoinGeckoPriceResult,
  CoinGeckoTokenResult,
} from "@/integrations/coingecko";
import { HTTP } from "@/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoinGeckoPriceResult>
) {
  if (!req.query.id || typeof req.query.id !== "string") {
    return res.status(400).end();
  }
  const http = new HTTP();
  const response = await http.get<Record<string, CoinGeckoPriceResult>>(
    `https://api.coingecko.com/api/v3/simple/price?ids=${req.query.id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`
  );
  res.setHeader("Cache-Control", "max-age=0, s-maxage=120");

  res.json(response?.[req.query.id]);
}
