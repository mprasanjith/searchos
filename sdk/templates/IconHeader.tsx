import { Text, Avatar, Flex } from "@/sdk";

interface IconHeaderProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

const IconHeader: React.FC<IconHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
}) => {
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
      <Avatar src={imageUrl} radius="xl" size="lg" />

      <Text size="xl" mt="xs">
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

export default IconHeader;
