import { getExtensionsForGPT } from "@/utils/extensions";
import { buildSystemMessage, getChatCompletion } from "@/utils/server/openai";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const systemMessage = buildSystemMessage(getExtensionsForGPT());
  let completion = null;
  completion = await getChatCompletion(
    systemMessage,
    req.query.query as string
  );

  if (!completion) {
    // Looks like Chat Completion failed, try again
    completion = await getChatCompletion(
      systemMessage,
      req.query.query as string
    );
  }

  if (completion) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  }

  res.json(completion);
}
