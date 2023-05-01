import { HTTP } from "@/sdk";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  ErrorResponse,
  WalletPortfolioResponse,
} from "@/integrations/zerion/types"; // Replace this with the correct path to your WalletPortfolioResponse type

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<WalletPortfolioResponse | ErrorResponse>
) {
  const { address } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_ZERION_API_KEY;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Invalid address parameter" });
  }

  const http = new HTTP();
  try {
    const response = await http.get<WalletPortfolioResponse>(
      `https://api.zerion.io/v1/wallets/${address}/transactions/?currency=usd&page[size]=5`,
      {
        headers: {
          accept: "application/json",
          authorization: `Basic ${apiKey}`,
        },
      }
    );

    res.setHeader("Cache-Control", "max-age=0, s-maxage=120");
    res.json(response);
  } catch (error) {
    console.error("Error fetching wallet portfolio data:", error);
    res.status(500).json({ error: "Failed to fetch wallet portfolio data" });
  }
}
