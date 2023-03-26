import { Detail, Stack } from "@/sdk";
import IconHeader from "@/sdk/templates/IconHeader";
import logo from "./icon.png";

const GitHubContribution: React.FC = () => (
  <Detail isPending={false} isError={false}>
    <Stack spacing="lg" m="md">
      <IconHeader
        title="SearchOS"
        subtitle="mprasanjith/searchos.git"
        imageUrl={logo.src}
        noBottomBorder
      />
    </Stack>
  </Detail>
);

export default GitHubContribution;
