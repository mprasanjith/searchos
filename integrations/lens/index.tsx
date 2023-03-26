import { Command, Extension } from "@/sdk";
import LensProfile from "./Lens";
import icon from "./icon.jpg";
import LensClient, { polygon } from "@lens-protocol/client";
import { sanitizeENS } from "@/sdk/helpers/sanitizers";

export class LensExtension extends Extension {
  private client: LensClient = new LensClient({
    environment: polygon,
  });

  name = "lens";
  title = "Lens";
  description = "Lens profiles";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-lens-profile",
      title: (query) => {
        const handle = sanitizeENS(query, ".lens");
        return `See ${handle}`;
      },
      description: "Find and follow frens via Lens Protocol",
      assistant: {
        description: "Get Lens Protocol Profile",
        params: ["lensHandle"],
      },
      shouldHandle: (query: string) => {
        return query.trim().toLowerCase().endsWith(".lens");
      },
      url: (query: string) => {
        const handle = query.trim().toLowerCase();
        return `https://lenster.xyz/u/${handle.replace(".lens", "")}`;
      },
      handler: ({ query, assistantQuery }) => {
        let handle = assistantQuery?.["lensHandle"] || query;

        const handleNormalized = sanitizeENS(handle, ".lens");

        if (!handleNormalized) return null;

        return <LensProfile client={this.client} handle={handleNormalized} />;
      },
    },
  ];

  async initialize() {}
}
