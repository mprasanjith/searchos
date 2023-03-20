import { useMantineTheme } from "@mantine/core";
import { useMemo } from "react";
import { Search, Searcher, Theme, Option } from "searchpal";
import pupa from "pupa";
import Media from "@/components/Media";
import { Command, Extension } from "@/sdk";
import Preview from "./Preview";

interface SearchboxProps {
  extensions: Extension[];
}

interface Action {
  extension: Extension;
  command: Command;
}

const Searchbox: React.FC<SearchboxProps> = ({ extensions }) => {
  const mantineTheme = useMantineTheme();

  const theme = useMemo(() => {
    const theme = new Theme({
      light: {
        shadow: mantineTheme.shadows.xs,
        accent: mantineTheme.primaryColor,
        accentText: mantineTheme.white,
        background: mantineTheme.white,
        text: mantineTheme.black,
        textSecondary: mantineTheme.colors.dark[1],
        borderColor: "transparent",
        borderWidth: "0",
        backdrop: "transparent",
        backdropOpacity: "2",
        optionBackground: "transparent",
        optionText: "inherit",
        optionSelectedBackground: mantineTheme.colors.gray[2],
        optionSelectedText: "inherit",
      },
      dark: {
        shadow: mantineTheme.shadows.xs,
        accent: mantineTheme.primaryColor,
        accentText: mantineTheme.white,
        background: mantineTheme.colors.dark[7],
        text: mantineTheme.white,
        textSecondary: mantineTheme.colors.dark[3],
        borderColor: "transparent",
        borderWidth: "0",
        backdrop: "transparent",
        backdropOpacity: "2",
        optionBackground: "transparent",
        optionText: "inherit",
        optionSelectedBackground: mantineTheme.colors.dark[6],
        optionSelectedText: "inherit",
      },
    });

    return theme;
  }, [mantineTheme]);

  const actions = useMemo(() => {
    const actions: Action[] = [];
    extensions.forEach((extension) => {
      extension.commands.forEach((command) => {
        actions.push({
          extension,
          command,
        });
      });
    });
    return actions;
  }, [extensions]);

  const searcher: Searcher = async (query) => {
    return actions.map((action) => {
      if (!action.command.shouldHandle(query)) return null;

      return (
        <Option
          key={`${action.extension.name}-${action.command.name}`}
          label={
            typeof action.command.title == "function"
              ? action.command.title(query)
              : pupa(action.command.title, { query })
          }
          img={
            action.extension.icon
              ? { src: action.extension.icon as any }
              : undefined
          }
          button={() => null}
          media={Media}
          preview={<Preview action={action} query={query} />}
        />
      );
    });
  };

  return (
    <Search
      dark={mantineTheme.colorScheme === "dark"}
      theme={theme}
      label="Search web3..."
      labels={{
        title: "Search prompt",
        subtitle: "Use this dialog to perform a web3 search.",
        results: "Search results",
        noResults: {
          title: "No results found for query.",
          subtitle: "Try searching for something else.",
        },
      }}
      open={true}
      onClose={() => {}}
      animate={"fade"}
    >
      {async (q) => {
        const res = await searcher(q);
        return res;
      }}
    </Search>
  );
};
export default Searchbox;
