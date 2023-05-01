import { ChainData, TokenData } from "@/utils/types/data";
import { NextApiHandler } from "next";
import pMap from "p-map";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const query = req.query.q as string;
  const chain = req.query.chain as string;

  if (!query || !chain) {
    throw new Error("Invalid query");
  }

  const url = `https://api.zerion.io/v1/fungibles/?currency=usd&page[size]=100&filter[search_query]=${query}&filter[implementation_chain_id]=${chain}&sort=-market_data.market_cap`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Basic ${Buffer.from(
        process.env.ZERION_API_KEY + ":"
      ).toString("base64")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error searching tokens");
  }
  const result = await response.json();
  if (result.data.length === 0) {
    throw new Error("No match found");
  }

  const match =
    result.data.find(
      (token: any) =>
        token.attributes?.symbol?.toLowerCase() === query?.toLowerCase()
    ) || result.data[0];
  const implementation = match?.attributes?.implementations.find(
    (impl: any) => impl.chain_id === chain
  );
  const token: TokenData = {
    chain: chain,
    name: match?.attributes?.name,
    symbol: match?.attributes?.symbol,
    decimals: implementation?.decimals,
    address: implementation?.address,
    logoURI: match?.attributes?.icon?.url,
  };

  if (result) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  }
  return res.json(token);
};

export default handler;
