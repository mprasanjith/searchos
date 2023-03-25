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
      title: (query) => query,
      description: "Get AI powered responses",
      assistant: {
        description: "Get responses from OpenAI",
        params: [],
      },
      shouldHandle: (query) => {
        if (query.length < 8 || query.split(" ").length < 2) return false;
        return true;
      },
      handler: ({ query }) => <ChatGPT client={this.client} query={query} />,
    },
  ];
}
