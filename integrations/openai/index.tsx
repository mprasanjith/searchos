import { Command, Extension } from "@/sdk";
import icon from "./icon.jpg";
import ChatGPT from "./ChatGPT";
import { ChatGPTClient } from "./client";

export class OpenAIExtension extends Extension {
  private client: ChatGPTClient = new ChatGPTClient();

  name = "openai";
  title = "OpenAI";
  description = "Get natural language results from OpenAI";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "natural-language",
      title: (query) => {
        return query?.length > 30 ? query.slice(0, 25) + "..." : query;
      },
      description: "Query web3 using AI",
      assistant: {
        description: "Get responses from OpenAI",
        params: [],
      },
      shouldHandle: (query) => {
        if (query.length < 8 || query.split(" ").length < 2) return false;
        return true;
      },
      handler: ({ query, chainId }) => (
        <ChatGPT client={this.client} query={query} chainId={chainId} />
      ),
    },
  ];
}
