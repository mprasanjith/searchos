import { apps } from "@/extensions/apps";
import resolvers from "@/extensions/resolvers";
import { Configuration, OpenAIApi } from "openai";
import { Task } from "../types";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const buildSystemMessage = () => {
  const intro = [
    "The AI assistant can parse user input to several tasks and Put it in the following JSON structure:",
    `[{"task": taskName, "id": task_id_num, "args": {<KEY>: text or <GENERATED>-dep_task_id_num}}]`,
    `The special string tag "<GENERATED>-dep_task_id_num" refer to the one generated response in the dependency task (Please consider whether the dependency task generates resources of this type.). For example, <GENERATED>-1, <GENERATED>-2 ...`,
    `"args" is a key-value object of parsed arguments to the task.`,
    `Do not format the JSON. Do not have any other messages other than the JSON.`,
    `The task MUST be selected from the following options:`,
  ];

  const tools: string[] = [];

  resolvers.forEach((resolver) => {
    let action = `"${resolver.name}(${Object.entries(resolver.params)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}): ${resolver.returnValue}"`;
    if (resolver.description) {
      action = `${action} - ${resolver.description}`;
    }

    tools.push(action);
  });

  apps.forEach((app) => {
    let action = `"${app.name}(${Object.entries(app.props)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ")}): void"`;
    if (app.description) {
      action = `${action} - ${app.description}`;
    }

    tools.push(action);
  });

  const outro = `There may be multiple tasks of the same type. Think step by step about all the tasks needed to resolve the user's request. Parse out as few tasks as possible while ensuring that the user request can be resolved. Pay attention to the dependencies and order among tasks. If the user input can't be parsed, you NEED to reply empty JSON [].`;

  return [...intro, ...tools, outro].join("\n");
};

export const getCompletion = async (
  systemMessage: string,
  userRequest: string,
  chainId: number,
  walletAddress: string
) => {
  const userMessage = [
    userRequest,
    `Current chain ID: ${chainId}`,
    `User wallet address: ${walletAddress}`,
  ].join("\n");

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userMessage },
    ],
  });

  const response = completion.data?.choices?.[0]?.message?.content;

  if (!response) {
    return null;
  }

  try {
    const responseJson: Task[] = findJSON(response);
    return responseJson;
  } catch (e) {
    return null;
  }
};

function findJSON(str: string) {
  let preparsed: string;
  try {
    const json = JSON.parse(str);
    if (typeof json === "object") {
      preparsed = JSON.stringify([json]);
    }
    preparsed = JSON.stringify(json);
  } catch (e) {
    preparsed = str;
  }

  let startIndex = -1;
  let endIndex = -1;
  let openBrackets = 0;

  for (let i = 0; i < preparsed.length; i++) {
    const char = preparsed[i];

    if (char === "[") {
      if (startIndex === -1) {
        startIndex = i;
      }
      openBrackets++;
    } else if (char === "]") {
      openBrackets--;

      if (openBrackets === 0 && startIndex !== -1) {
        endIndex = i;
        break;
      }
    }
  }

  if (startIndex !== -1 && endIndex !== -1) {
    const jsonString = preparsed.slice(startIndex, endIndex + 1);
    let parsed = JSON.parse(jsonString);
    return parsed;
  } else {
    throw new Error("Invalid response");
  }
}
