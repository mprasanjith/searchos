<img width="1920" alt="readme_searchos" src="https://user-images.githubusercontent.com/34306844/227747197-7c7b0d29-f9d5-4978-8966-98107b7bc9f7.png">

# SearchOS

**All your favorite web3 actions, one search away 🔎**

SearchOS is a web3 search engine making it easy to interact with your favorite blockchain applications. Query wallet balances, see real-time prices, swap, bridge, and send tokens (cross-chain) in just a few clicks.

- 🧠 Out-of-the-box natural language processing
- 🛠️ Endless integration opportunities
- 🧗‍♂️ Built on top of [Next.js](https://nextjs.org/) and [wagmi](https://github.com/tmm/wagmi)

**Live on [searchos.xyz](https://searchos.xyz/)**

## Demo

**[View the demo here](https://drive.google.com/file/d/1dICr_P9-wMKBQT_ePRMLbCkSlWj3xX4E/view?usp=sharing)**

## Getting Started

```
git clone --recurse-submodules https://github.com/mprasanjith/searchos.git
```

if you've cloned this without using `--recurse-submodules` flag, run:

```
git submodule update
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build your own extensions

### Extensions

SearchOS extensions are simple TypeScript classes that implement the `Extension` interface in the SearchOS SDK. Each extension contains some basic metadata and a list of web3 actions (`Command`s) it supports. Extensions also contain React components that will be rendered when the user selects one of these actions.

### Commands

Each web3 action exposed by an extension is represented as a `Command`. A command can be any action you want to be shown in the search results. Each command defines a bunch of configurations deciding when and how the action is shown in the search results. The command also defines the React component that will be rendered when the action is selected in search results.

Your command will be shown in the search results in the following cases:

- **Keyword-based**: Your command decides to show itself based on the user query. This could be done with simple string matching or more complex logic. In this case you will not have any other parameters to work with, except for the user query.
- **AI-based**: The AI model decides to show your command based on the user query. The AI model will also try to find correct parameters to send to your command. You will still have access to the user query string as well. You will have to parse the user query and the parameters generated by the AI model to show the UI.

### Writing an extension

You can look at any of the existing extensions in the `integrations` directory to get an idea of how to write your own extension. The gist is as follows:

1. Create a new folder in the `integrations` directory with your extension name.
2. Write the extension code in the `index.jsx` file. You should extend the the `Extension` interface in `@/sdk` to define your commands.
3. Write the React component UI for your command in a separate file. You can import this file to the `index.jsx` file and render it in command's `handler`.
4. Import your extension in the `utlils/extensions.ts` file and initialize it in the `getExtensionsForGPT()` function.

### Extension structure

What a typical extension looks like:

```typescript
import { Extension, Command } from "@/sdk";
import icon from "./icon.png";
import TestComponent from "./TestComponent";

export class TestExtension extends Extension {
  // Name of the extension. Can be anything.
  name: "test-extension";

  // Metadata of the extension. Will be used in the extension store in the future.
  title: "Test Extension";
  description: "This is a test extension.";
  author: "John Doe";

  // Icon of the extension. Can be a URL or a imported image file.
  icon: icon;

  // Supported commands
  commands: Command[] = [
    {
      // Name of the command. Can be anything.
      name: "test-command",

      // Metadata of the command. Will be shown in the search results.
      title: "Test Command",
      // Alternatively, you can also return a string based on the search query user enters.
      //   title: (query) => {
      //     return `Test Command: ${query}`;
      //   },

      // Description of the command. Will be shown in the search results.
      description: "This is a test command.",
      // Alternatively, you can also return a string based on the search query user enters.
      //   description: (query) => {
      //     return `This is a test command: ${query}`;
      //   },

      // Instructions for the GPT model, used to generate AI powered suggestions.
      assistant: {
        // Description on what the command does.
        description: "This is a test command.",
        // A list of parameters that the command accepts.
        params: ["param1", "param2"],
      },

      // URL that will be linked to the suggestion.
      url: "https://example.com",
      // Alternatively, you can also return a URL based on the search query user enters.
      //   url: (query) => {
      //     return `https://example.com/${query}`;
      //   },

      // Should the command be shown in the search results.
      shouldHandle: (query) => {
        // This will be called when the user enters a query.
        // Return true if the command should be shown in the search results.
        return true;
      },

      // Handler function that will be called when the command is shown.
      // Query is the user query.
      // assistantQuery is the query generated by the GPT model. This would be a key-value object, with the keys being the parameter names you've defined in the assistant config above. Be aware that the values will be strings and you will have to parse this data.
      handler: ({ query, assistantQuery }) => {
        // Parse the user query and assistantQuery to get the parameters.
        // and return the React component UI, optionally with parameters.
        return <TestComponent testParam1={param1} testParam2={param2} />;
      },
    },
  ];

  async initialize() {
    // You can optionally do any initalization for the extension here.
    // This will be called when the extension is loaded for the first time.
  }
}
```

### Writing React components

We have a SDK that exposes Mantine UI components, essential libraries such as `ethers.js`, `wagmi` as well as some helper functions to help you build your UI. You can import these from `@/sdk`. We encourage you to use Mantine UI components as much as possible to keep the UI consistent across all extensions.

## Contributions

Feel free to [open an issue](https://github.com/mprasanjith/searchos/issues/new/choose) or [a PR](https://github.com/mprasanjith/searchos/compare).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
