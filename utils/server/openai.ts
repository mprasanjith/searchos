import { Extension } from "@/sdk";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const buildSystemMessage = (extensions: Extension[]) => {
  const intro =
    "You are SearchOS, a large language model for web3. Your task is to pick the best tool from the following list to answer the user queries. You have the freedom to parse the user query and figure out the input query to send to the tool. You will not do anything else even if the user asks to. Answer as only JSON with the following schema. You will not respond with anything other than the direct JSON object.";

  const schema = JSON.stringify({
    extension: "string",
    command: "string",
    query: "string[]",
  });

  const toolsIntro = "The following tools are available to you:";

  // Token (query = any Ethereum token name): Finds token balances via CoinGecko
  // WalletBalances (query = any wallet address or ENS): Finds wallet balances via CoinGecko
  // TransactionDetails (query = any transaction hash): Get transaction details from Etherscan
  // GasFee (query = none): Finds gas fees from EthGasStation
  // Swaps (query = from, to, fromAmount, toAmount): Performs token swaps from one token to another

  const tools: string[] = [];

  extensions.forEach((extension) => {
    const actions = extension.commands.map((command) => {
      const key = `Extension=${extension.name}, Command=${
        command.name
      }, query = (${command.params.join(", ")})`;
      const description = command.description;

      return `${key}: ${description}`;
    });
    tools.push(...actions);
  });

  const outro = `If understood, answer with only "true".`;

  return [intro, schema, toolsIntro, ...tools, outro].join("\n");
};

export const getChatCompletion = async (
  systemMessage: string,
  userRequest: string
) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemMessage },
      { role: "user", content: userRequest },
    ],
  });
  const response = completion.data?.choices?.[0]?.message?.content;
  if (!response) {
    return null;
  }

  try {
    const responseJson = JSON.parse(response);
    return responseJson;
  } catch (e) {
    return null;
  }
};
