import { Command, Extension } from "@/sdk";
import LensProfile from "./Lens";
import icon from "./icon.png";
import LensClient, { polygon } from "@lens-protocol/client";

export class LensExtension extends Extension {

private client: LensClient = new LensClient({
    environment: polygon
});

  name = "lens";
  title = "Lens";
  description = "Lens profiles";
  author = "SearchOS";
  icon = icon;

  commands: Command[] = [
    {
      name: "get-lens-profile",
      title: "Get Lens profile",
      description: "Get Lens Profile with the Lens SDK",
      shouldHandle: (query: string) => {
        return query.trim().toLowerCase().includes(".lens");
      },
      url: (query: string) => {
        return`https://lenster.xyz/u/${query.replace(".lens", "")}`
      },
      handler: ({ query }) => <LensProfile query={query} client={this.client}/>,
    },
  ];

  async initialize() {}
}
