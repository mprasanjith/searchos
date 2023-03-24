import { Alert, Box, Center, ScrollArea, Skeleton } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { IconAlertCircle } from "@tabler/icons-react";

export interface DetailProps {
  isPending?: boolean;
  isError?: boolean;
  markdown?: string;
  children?: JSX.Element;
  navigationTitle?: string;
  metadata?: React.ReactNode;
}

export const Detail: React.FC<DetailProps> = ({
  isPending,
  isError,
  markdown,
  children,
}) => {
  if (isError) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
        Something went wrong while loading this data.
      </Alert>
    );
  }
  return (
    <Skeleton visible={isPending}>
      {markdown ? (
        <Center ta="center">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </Center>
      ) : (
        <ScrollArea.Autosize mah="35rem" type="auto">{children}</ScrollArea.Autosize>
      )}
    </Skeleton>
  );
};
