import { Command, Extension, useNetwork } from "@/sdk";
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
  const { chain } = useNetwork();

  const Component = action.command.handler;
  return <Component query={query} chainId={chain?.id || 1} />;
};

export default Preview;
