import { Text, Avatar, Flex } from "@/sdk";

interface IconHeaderProps {
  title?: string;
  subtitle?: string;
}

const TextHeader: React.FC<IconHeaderProps> = ({ title, subtitle }) => {
  return (
    <Flex
      p="md"
      justify="center"
      direction="column"
      align="center"
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[1]}`,
      })}
    >
      <Text size="xl">
        {title}
      </Text>

      {subtitle && (
        <Text size="sm" color="dimmed">
          {subtitle}
        </Text>
      )}
    </Flex>
  );
};

export default TextHeader;
