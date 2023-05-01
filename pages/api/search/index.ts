import { buildSystemMessage, getCompletion } from "@/utils/server/openai";
import { buildGraph, executeGraph } from "@/utils/shared/graph";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (!req.query.chain || !req.query.wallet || !req.query.q) {
    throw new Error("Invalid query");
  }

  const chain = String(req.query.chain).trim();
  const walletAddress = String(req.query.wallet).trim();
  const query = String(req.query.q).trim();

  const systemMessage = buildSystemMessage();
  const completion = await getCompletion(
    systemMessage,
    query,
    chain,
    walletAddress
  );
  if (!completion) {
    throw new Error("Error resolving query");
  }

  const graph = await buildGraph(completion);

  const executedGraph: any = await executeGraph(graph);

  // executedGraph.forEachNode((nodeId, args) => {
  //   console.log({ nodeId, args });
  // });

  const uiNodeId = executedGraph.findNode(
    (_: any, attributes: Record<string, any>) => !!attributes.isInterface
  );

  if (!uiNodeId) {
    throw new Error("No UI node found");
  }

  const uiNode = graph.getNodeAttributes(uiNodeId);

  if (completion) {
    res.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  }

  res.json(uiNode);
};

export default handler;
