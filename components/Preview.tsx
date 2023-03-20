import { Command, Extension } from "@/sdk";
import { Flex } from "@mantine/core";

interface Action {
  extension: Extension;
  command: Command;
}

interface PreviewProps {
  action: Action;
  query: string;
}

const Preview: React.FC<PreviewProps> = ({ action, query }) => {
  const Component = action.command.handler;
  return <Component query={query} />;
};

export default Preview;
