import { HTTP } from "@/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import type { WalletPortfolioResponse } from "@/integrations/zerion/types"; // Replace this with the correct path to your WalletPortfolioResponse type

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WalletPortfolioResponse>
) {
  const { address } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_ZERION_API_KEY;

  if (!address || typeof address !== "string") {
    return res.status(400).end();
  }

  const http = new HTTP();
  const response = await http.get<WalletPortfolioResponse>(
    `https://api.zerion.io/v1/wallets/${address}/portfolio/`,
    {
      headers: {
        accept: 'application/json',
        authorization: `Basic ${apiKey}`,
      },
    }
  );

  res.setHeader("Cache-Control", "max-age=0, s-maxage=120");
  res.json(response);
}