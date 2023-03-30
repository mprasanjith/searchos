import { HTTP } from "@/sdk/helpers";

export interface CommandCompletion {
  extension?: string;
  command?: string;
  query?: Record<string, string>;
  message?: string;
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class ChatGPTClient {
  private http: HTTP = new HTTP();

  async getCompletion(query: string) {
    await delay(1500);
    return this.http.get<CommandCompletion>(`/api/completion?query=${query}`);
  }
}
