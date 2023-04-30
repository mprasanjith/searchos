import { buildSystemMessage, getCompletion } from "@/utils/server/openai";
import { buildGraph, executeGraph } from "@/utils/shared/graph";
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
  if (!completion) {
    throw new Error("Error resolving query");
  }

  const graph = buildGraph(completion);

  graph.forEachNode((node: any, attr: Record<string, any>) => {
    console.log(node, attr);
  });

  const executedGraph: any = await executeGraph(graph);
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
