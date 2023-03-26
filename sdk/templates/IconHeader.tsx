import { Text, Avatar, Flex } from "@/sdk";

interface IconHeaderProps {
  title?: string | null;
  subtitle?: string | null;
  imageUrl?: string | null;
  noBottomBorder?: boolean;
}

const IconHeader: React.FC<IconHeaderProps> = ({
  title,
  subtitle,
  imageUrl,
  noBottomBorder
}) => {
  return (
    <Flex
      p="md"
      justify="center"
      direction="column"
      align="center"
      sx={(theme) => ({
        borderBottom: !noBottomBorder ? `1px solid ${theme.colors.gray[1]}` : "none",
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
