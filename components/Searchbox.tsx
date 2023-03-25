import { Button, Flex, useMantineTheme } from "@mantine/core";
import { useMemo } from "react";
import { Search, Searcher, Theme, Option } from "searchpal";
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
        shadow: mantineTheme.shadows.xl,
        accent: mantineTheme.primaryColor,
        accentText: mantineTheme.white,
        background: mantineTheme.white,
        text: mantineTheme.black,
        textSecondary: mantineTheme.colors.dark[1],
        borderColor: mantineTheme.colors.gray[1],
        borderWidth: "1px",
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

  const searcher: Searcher = async (query: string) => {
    return actions.map((action) => {
      if (!action.command.shouldHandle(query)) return null;

      return (
        <Option
          key={`${action.extension.name}-${action.command.name}`}
          label={
            typeof action.command.title == "function"
              ? action.command.title(query)
              : action.command.title
          }
          description={
            typeof action.command.description == "function"
              ? action.command.description(query)
              : action.command.description
          }
          img={
            action.extension.icon
              ? { src: action.extension.icon as any }
              : undefined
          }
          button={({ cta }) => {
            const url =
              typeof action.command.url == "function"
                ? action.command.url(query)
                : action.command.url;
            return url ? (
              <a href={url}>
                <Flex m="md">
                  <Button fullWidth variant="filled" color="dark.4">
                    {cta}
                  </Button>
                </Flex>
              </a>
            ) : null;
          }}
          href={
            typeof action.command.url == "function"
              ? action.command.url(query)
              : action.command.url
          }
          cta={
            typeof action.command.cta == "function"
              ? action.command.cta(query)
              : action.command.cta || "See details"
          }
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
      link={({ href, children }) => (
        <a
          href={href}
          style={{ textDecoration: "none", color: "initial" }}
          target="_blank"
        >
          {children}
        </a>
      )}
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
