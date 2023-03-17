import { CoinGeckoTokenResult } from "@/integrations/coingecko";
import { HTTP } from "@/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CoinGeckoTokenResult[]>
) {
  const http = new HTTP();
  const tokens = await http.get<CoinGeckoTokenResult[]>(
    `https://api.coingecko.com/api/v3/coins/list?include_platform=false`
  );
  res.setHeader("Cache-Control", "max-age=0, s-maxage=86400")
  res.json(tokens);
}
