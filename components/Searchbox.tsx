import { useMantineTheme } from "@mantine/core";
import { useMemo } from "react";
import { Search, Searcher, Theme, Option } from "@/components/searchpal/lib";
import pupa from "pupa";
import Media from "@/components/Media";
import { Command, Extension } from "@/sdk";
import Preview from "./Preview";
import { Matcher } from "ecolect-parser";

interface SearchboxProps {
  extensions: Extension[];
  intents: Matcher<any>;
}

interface Action {
  id: string;
  extension: Extension;
  command: Command;
}

interface Match {
  id: string;
  score: number;
  values: Record<string, any>;
  action?: Action;
}

const Searchbox: React.FC<SearchboxProps> = ({ extensions, intents }) => {
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
          id: `${extension.name}:${command.name}`,
          extension,
          command,
        });
      });
    });
    return actions;
  }, [extensions]);

  const searcher: Searcher = async (query: string) => {
    const matches: Match[] = await intents.matchPartial(query);

    console.log({ matches });

    const matchedActions = matches.map((match) => ({
      ...match,
      action: actions.find((action) => match.id === action.id) || actions[0],
    }));

    return matchedActions.map(({ action, values }) => {
      if (
        action.command.shouldHandle &&
        !action.command.shouldHandle({ query, values })
      )
        return null;

      return (
        <Option
          key={`${action.extension.name}-${action.command.name}`}
          label={
            typeof action.command.title == "function"
              ? action.command.title({ query, values })
              : action.command.title
          }
          description={
            typeof action.command.description == "function"
              ? action.command.description({ query, values })
              : action.command.description
          }
          img={
            action.extension.icon
              ? { src: action.extension.icon as any }
              : undefined
          }
          button={() => null}
          media={Media}
          preview={<Preview action={action} query={query} values={values} />}
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
