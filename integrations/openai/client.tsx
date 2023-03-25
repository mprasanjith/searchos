import { Extension } from "@/sdk";
import { HTTP } from "@/sdk/helpers";
import { getExtensionsForGPT } from "@/utils/extensions";

export interface CommandCompletion {
  extension?: string;
  command?: string;
  query?: Record<string, string>;
  message?: string;
}

export class ChatGPTClient {
  private http: HTTP = new HTTP();
  private extensions: Extension[] = getExtensionsForGPT();

  async getCompletion(query: string) {
    return this.http.get<CommandCompletion>(`/api/completion?query=${query}`);
  }

  getMatchingExtension(completion: CommandCompletion) {
    return this.extensions.find((extension) => {
      return extension.name === completion.extension;
    });
  }

  getMatchingCommand(completion: CommandCompletion, extension: Extension) {
    return extension.commands.find((command) => {
      return command.name === completion.command;
    });
  }
}
