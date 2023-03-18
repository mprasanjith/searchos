import { StaticImageData } from "next/image";

export enum CommandType {
  Informational,
  Actionable,
}

export interface CommandHandlerProps {
  query: string;
}

export interface Command {
  name: string;
  title: string;
  description: string;
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
