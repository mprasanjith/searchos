import { DirectedGraph, UndirectedGraph } from "graphology";
import { Task } from "../types";
import { hasCycle, topologicalSort } from "graphology-dag";
import { apps } from "../../extensions/apps";
import pWaterfall from "p-waterfall";
import resolvers from "@/extensions/resolvers";

export function buildGraph(tasks: Task[]) {
  const graph: any = new DirectedGraph();

  let foundInterface = false;
  tasks.forEach((task) => {
    const destId = task.id;
    const isInterface = !!apps.find((app) => task.task.includes(app.name));

    if (!isInterface || (isInterface && !foundInterface)) {
      // Add nodes
      graph.mergeNode(destId);
      graph.mergeNodeAttributes(destId, {
        task: task.task,
        args: task.args,
        isInterface,
      });

      // Add edges
      if (task.args && typeof task.args === "object") {
        Object.entries(task.args).forEach(([key, value]) => {
          if (String(value).startsWith("<GENERATED>-")) {
            const sourceId = Number.parseInt(value.split("-")?.[1]);
            graph.mergeEdge(sourceId, destId, { field: key });
          }
        });
      }

      if (isInterface) {
        foundInterface = true;
      }
    }
  });

  if (hasCycle(graph)) {
    throw new Error("Cyclic dependency found");
  }

  return graph;
}

export async function executeGraph(graph: UndirectedGraph) {
  const executionOrder = topologicalSort(graph);
  const executedGraph = await pWaterfall(
    [
      ...executionOrder.map((nodeId) => async (graph: any) => {
        const attributes = graph.getNodeAttributes(nodeId);
        const result = await executeNode(attributes);

        if (result) {
          graph.forEachOutboundEdge(
            nodeId,
            (edge: any, attributes: any, source: string, target: string) => {
              const field = attributes.field;
              const prevArgs = graph.getNodeAttribute(target, "args");
              prevArgs[field] = result;
              graph.setNodeAttribute(target, "args", prevArgs);
            }
          );
        }

        return graph;
      }),
    ],
    graph
  );

  return executedGraph;
}

async function executeNode(attributes: Record<string, any>) {
  const taskName = attributes.task;
  const resolver = resolvers.find((resolver) => resolver.name === taskName);

  if (resolver) {
    const argsArray = Object.keys(resolver.params).map(
      (param) => attributes?.args?.[param]
    );
    console.log("argsArray", argsArray);
    const result = await resolver.handler(argsArray);

    return result;
  }

  return undefined;
}
