import { StaticImageData } from "next/image";
import { DetailProps } from "./components";

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
  type: CommandType;
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
