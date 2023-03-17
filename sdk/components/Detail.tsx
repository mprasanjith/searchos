import { Alert, Center, Skeleton } from "@mantine/core";
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
  metadata,
  navigationTitle,
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
        <Center>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </Center>
      ) : (
        children
      )}
    </Skeleton>
  );
};
