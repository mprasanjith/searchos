import { useMantineTheme } from "@mantine/core";
import Media from "@/components/Media";
import { users } from "@/data/users";
import { Search, Option, Detail, Theme } from "searchpal";
import { useMemo } from "react";

const Index = () => {
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

  const fetchResults = async (query: string) => {
    return users.map((user) => (
      <Option
        key={user.id}
        label={user.name}
        sublabel={
          <>
            <div>Matched for {query}</div>
            <div>@{user.handle}</div>
            <div>{user.email}</div>
          </>
        }
        img={{ src: user.avatar }}
        cta="See full profile"
        media={Media}
        // preview={
        //   <div className="preview">
        //     <h2>{user.name}</h2>
        //   </div>
        // }
      />
    ));
  };

  return (
    <div>
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
        {fetchResults}
      </Search>
    </div>
  );
};

export default Index;
