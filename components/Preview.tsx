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
  return (
    <Flex
      gap="xs"
      justify="center"
      align="center"
      direction="column"
      wrap="wrap"
    >
      <Component query={query} />
    </Flex>
  );
};

export default Preview;
