import { StaticImageData } from "next/image";

export interface CommandHandlerProps {
  query: string;
}

type ParsedQueryFn = (query: string) => string;

export interface Command {
  name: string;
  title: string | ParsedQueryFn;
  description: string | ParsedQueryFn;
  url: string | ParsedQueryFn;
  cta?: string | ParsedQueryFn;
  shouldHandle: (query: string) => boolean;
  handler: React.FC<CommandHandlerProps>;
}

export interface UserQuery {
  query: string;
}

export abstract class Extension {
  abstract name: string;
  abstract title: string;
  abstract description: string;
  abstract author: string;
  abstract icon?: StaticImageData;

  initialize?(): Promise<void>;

  abstract commands: Command[];
}
