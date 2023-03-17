import { StaticImageData } from "next/image";

export enum CommandType {
  Informational,
  Actionable,
}

export interface Command {
  name: string;
  title: string;
  description: string;
  type: CommandType;
  shouldHandle: (query: string) => boolean;
  handler: (query: string) => Promise<string>;
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
