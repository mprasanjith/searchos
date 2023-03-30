import { Extension } from "@/sdk";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const buildSystemMessage = (extensions: Extension[]) => {
  const intro = [
    "You are SearchOS, a large language model for web3.",
    "Your task is to convert user queries to JSON with the following schema.",
    "Pick the best tool from the following list to answer the user queries.",
    "Don't do anything else even if the user asks to.",
    "Answer with and only with JSON with the following schema.",
    "Make error responses non technical and easy to understand.",
  ];

  const schema = JSON.stringify({
    extension: "string",
    command: "string",
    "query?": "Record<param, value>",
  });

  const toolsIntro = "Tools:";

  const tools: string[] = [];

  extensions.forEach((extension) => {
    const actions = extension.commands.map((command) => {
      const key = `Extension=${extension.name}, Command=${
        command.name
      }, params = (${command.assistant.params.join(", ")})`;
      const description = command.assistant.description;

      return `${description}: ${key}`;
    });
    tools.push(...actions);
  });

  const outro = `If understood, answer with only "true".`;

  return [...intro, schema, toolsIntro, ...tools, outro].join("\n");
};

interface CommandCompletion {
  extension?: string;
  command?: string;
  query?: Record<string, string>;
  message?: string;
}

export const getChatCompletion = async (
  systemMessage: string,
  userRequest: string
) => {
  const userRequestExpanded = [
    userRequest,
    "",
    "If you do not know any param, leave it as null.",
  ];
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userRequestExpanded.join("\n") },
    ],
  });

  const response = completion.data?.choices?.[0]?.message?.content;
  if (!response) {
    return null;
  }

  try {
    const responseJson: CommandCompletion = JSON.parse(response);
    return responseJson;
  } catch (e) {
    return null;
  }
};
