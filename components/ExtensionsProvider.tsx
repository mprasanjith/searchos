import { Command, Extension } from "@/sdk";
import { getExtensions } from "@/utils/extensions";
import { PropsWithChildren, createContext, useCallback, useEffect, useMemo } from "react";

interface ExtensionsContextProps {
  extensions: Extension[];
  getMatchingExtension: (extensionName: string) => Extension | undefined;
  getMatchingCommand: (
    extension: Extension,
    commandName: string
  ) => Command | undefined;
}

export const ExtensionsContext = createContext<ExtensionsContextProps>({
  extensions: [],
  getMatchingCommand: () => undefined,
  getMatchingExtension: () => undefined,
});

const ExtensionsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const extensions = useMemo(() => getExtensions(), []);

  useEffect(() => {
    extensions.forEach((extension) => extension.initialize?.());
  }, [extensions]);
  
  function getMatchingExtension(extensionName: string) {
    return extensions.find((extension) => {
      return extension.name === extensionName;
    });
  }

  function getMatchingCommand(extension: Extension, commandName: string) {
    return extension.commands.find((command) => {
      return command.name === commandName;
    });
  }

  return (
    <ExtensionsContext.Provider
      value={{ extensions, getMatchingCommand, getMatchingExtension }}
    >
      {children}
    </ExtensionsContext.Provider>
  );
};

export default ExtensionsProvider;
