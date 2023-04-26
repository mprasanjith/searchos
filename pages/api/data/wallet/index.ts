import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const ethAddress = req.query.ethAddress as `0x${string}`;
  if (!ethAddress) {
    res.status(400).json({ error: "Missing address" });
    return;
  }

  const response = await fetch(
    `https://api.zerion.io/v1/wallets/${ethAddress}/portfolio/?currency=usd`,
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
  const result = await response.json();
  return res.json(result)
};

export default handler;
