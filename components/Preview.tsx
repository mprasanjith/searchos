import { Command, CommandHandlerProps, Extension } from "@/sdk";

interface Action {
  extension: Extension;
  command: Command;
}

interface PreviewProps extends CommandHandlerProps {
  action: Action;
}

const Preview: React.FC<PreviewProps> = ({ action, query, values }) => {
  const Component = action.command.handler;
  return <Component query={query} values={values} />;
};

export default Preview;
