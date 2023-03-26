import { Command, Extension } from "@/sdk";
import icon from "./icon.png";
import GitHubContribution from "./GitHubContribution";

export class GitHubContributionsExtension extends Extension {

  name = "ghcontrib";
  title = "GitHub Contributions";
  description = "Contribute to SearchOS on GitHub";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "contribute",
      title: "Contribute to SearchOS's Results",
      description: "Integrate your application via GitHub",
      cta: "New pull request",
      assistant: {
        description: "Contribute to SearchOS on GitHub",
        params: [],
      },
      shouldHandle: (query: string) => {
        const wordsToHandle = ["contribute", "code", "github", "extension", "extend"];
        return wordsToHandle.some(
          (word) => query.trim().toLowerCase() === word
        );
      },
      url: "https://github.com/mprasanjith/searchos",
      handler: () => <GitHubContribution />,
    },
  ];

  async initialize() {}
}
