import { Renderable } from "@/components/searchpal/lib/types";
import { Text, Flex, Group } from "@/sdk";

interface DetailsGridProps {
  details: Record<string, Renderable>;
}

const DetailsGrid: React.FC<DetailsGridProps> = ({ details }) => {
  return (
    <Flex
      m="lg"
      gap="xs"
      direction="column"
      sx={{ fontSize: "0.96rem", gap: "0.26rem" }}
    >
      {Object.entries(details).map((detail, key) => (
        <Group key={key} align="flex-end" spacing="xs">
          <Text w="6rem" color="dimmed">
            {detail[0]}
          </Text>
          <Text>{detail[1]}</Text>
        </Group>
      ))}
    </Flex>
  );
};

export default DetailsGrid;
