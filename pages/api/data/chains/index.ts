import { ChainData } from "@/utils/types/data";
import { NextApiHandler } from "next";
import pMap from "p-map";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const response = await fetch(`https://api.zerion.io/v1/chains`, {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization: `Basic ${Buffer.from(
        process.env.ZERION_API_KEY + ":"
      ).toString("base64")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error fetching chains list");
  }
  const result = await response.json();

  const chainsWithNativeToken = await pMap(
    result.data,
    async (chain: any) => {
      const tokenResponse = await fetch(
        chain?.relationships?.native_fungible?.links?.related,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            authorization: `Basic ${Buffer.from(
              process.env.ZERION_API_KEY + ":"
            ).toString("base64")}`,
          },
        }
      );
      if (!tokenResponse.ok) {
        throw new Error("Error fetching native token for chain " + chain?.id);
      }
      const tokenResult = await tokenResponse.json();

      chain.nativeCurrency = {
        name: tokenResult.data.attributes.name,
        symbol: tokenResult.data.attributes.symbol,
        decimals: tokenResult.data.attributes.implementations?.find(
          (implementation: any) => implementation.chain_id === chain.id
        )?.decimals,
      };

      return chain;
    },
    { stopOnError: false }
  );

  const data: ChainData[] = chainsWithNativeToken?.map((chain: any) => ({
    name: chain?.attributes?.name,
    chain: chain?.id,
    chainId: Number.parseInt(chain?.attributes?.external_id, 16),
    icon: chain?.attributes?.icon?.url,
    rpc: chain?.attributes?.rpc?.public_servers_url,
    explorer: [
      {
        name: chain?.attributes?.explorer?.name,
        url: chain?.attributes?.explorer?.home_url,
      },
    ],
    nativeCurrency: chain.nativeCurrency,
  }));

  if (result) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  }
  return res.json(data);
};

export default handler;
