import { apps } from "@/extensions/apps";
import resolvers from "@/extensions/resolvers";
import { Extension } from "@/sdk";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const buildSystemMessage = () => {
  const intro = [
    "The AI assistant can parse user input to several tasks:",
    `[{"task": taskName, "id": task_id, "dep": dependency_task_id, "args": {<KEY>: text or <GENERATED>-dep_id}}]`,
    `The special tag "<GENERATED>-dep_id" refer to the one generated response in the dependency task (Please consider whether the dependency task generates resources of this type.) and "dep_id" must be in "dep" list. The "dep" field denotes the ids of the previous prerequisite tasks which generate a new resource that the current task relies on. "args" is a key-value object of parsed arguments to the task.`,
    `The task MUST be selected from the following options:`,
  ];

  const tools: string[] = [];

  resolvers.forEach((resolver) => {
    let action = `"${resolver.name}(${resolver.params.join(", ")}): ${
      resolver.returnValue
    }"`;
    if (resolver.description) {
      action = `${action} - ${resolver.description}`;
    }

    tools.push(action);
  });

  apps.forEach((app) => {
    let action = `"${app.name}(${Object.values(app.props).join(", ")}): void"`;
    if (app.description) {
      action = `${action} - ${app.description}`;
    }

    tools.push(action);
  });

  const outro = `There may be multiple tasks of the same type. Think step by step about all the tasks needed to resolve the user's request. Parse out as few tasks as possible while ensuring that the user request can be resolved. Pay attention to the dependencies and order among tasks. If the user input can't be parsed, you NEED to reply empty JSON [].`;

  return [...intro, ...tools, outro].join("\n");
};

interface CommandCompletion {
  extension?: string;
  command?: string;
  query?: Record<string, string>;
  message?: string;
}

export const getChatCompletion = async (
  systemMessage: string,
  userRequest: string,
  chainId: number,
  walletAddress: string
) => {
  const req = [
    userRequest,
    `Current chain ID: ${chainId}`,
    `User wallet address: ${walletAddress}`,
  ];

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: req.join("\n") },
    ],
  });

  const response = completion.data?.choices?.[0]?.message?.content;
  console.log("response", response);

  if (!response) {
    return null;
  }

  try {
    const responseJson: CommandCompletion = findJSON(response);
    return responseJson;
  } catch (e) {
    return null;
  }
};

function findJSON(str: string) {
  let startIndex = -1;
  let endIndex = -1;
  let openBraces = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char === "{") {
      if (startIndex === -1) {
        startIndex = i;
      }
      openBraces++;
    } else if (char === "}") {
      openBraces--;

      if (openBraces === 0 && startIndex !== -1) {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex !== -1 && endIndex !== -1) {
    const jsonString = str.slice(startIndex, endIndex + 1);
    let parsed = JSON.parse(jsonString);

    if (typeof parsed === "object") {
      parsed = [parsed];
    }

    // TODO: validate parsed JSON

    return parsed;
  } else {
    throw new Error("Invalid response");
  }
}
