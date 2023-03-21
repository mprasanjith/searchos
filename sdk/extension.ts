import { StaticImageData } from "next/image";

export interface CommandHandlerProps {
  query: string;
  values: Record<string, string>;
}

type ParsedQueryFn = (data: CommandHandlerProps) => string;

export enum ParamType {
  Text = "Text",
  // Integer = "Integer",
  // Number = "Number",
  // Ordinal = "Ordinal",
  // Date = "Date",
  // Time = "Time",
  // DateTime = "DateTime",
  // DateInterval = "DateInterval",
  // DateDuration = "DateDuration",
  // TimeDuration = "TimeDuration",
  // DateTimeDuration = "DateTimeDuration",
  // Enumeration = "Enumeration"
}

export interface Param {
  name: string;
  type: ParamType;
  // values?: any;
}

export interface Command {
  name: string;
  title: string | ParsedQueryFn;
  description: string | ParsedQueryFn;
  params?: Param[];
  intents: string[];
  shouldHandle?: (data: CommandHandlerProps) => boolean;
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
