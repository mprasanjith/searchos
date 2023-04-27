import { buildSystemMessage, getCompletion } from "@/utils/server/openai";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  const chainId = req.query.chain as string;
  const walletAddress = req.query.wallet as string;

  if (!chainId || !walletAddress) {
    throw new Error("Missing chainId or walletAddress");
  }

  const query = req.query.q as string;
  if (!query) {
    throw new Error("Missing query");
  }

  const systemMessage = buildSystemMessage();
  const completion = await getCompletion(
    systemMessage,
    query,
    parseInt(chainId),
    walletAddress
  );

  if (completion) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  }

  res.json(completion);
};

export default handler;
