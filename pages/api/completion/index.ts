import { getExtensionsForGPT } from "@/utils/extensions";
import { buildSystemMessage, getChatCompletion } from "@/utils/server/openai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const systemMessage = buildSystemMessage(getExtensionsForGPT());
  const completion = await getChatCompletion(
    systemMessage,
    req.query.query as string
  );
  res.setHeader("Cache-Control", "max-age=0, s-maxage=120");
  res.json(completion);
}
