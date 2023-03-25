import { HTTP } from "@/sdk/helpers";

export interface CommandCompletion {
  extension?: string;
  command?: string;
  query?: Record<string, string>;
  message?: string;
}

export class ChatGPTClient {
  private http: HTTP = new HTTP();

  async getCompletion(query: string) {
    return this.http.get<CommandCompletion>(`/api/completion?query=${query}`);
  }
}
