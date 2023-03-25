import {
  Alert,
  Box,
  Center,
  CommandHandlerProps,
  Detail,
  IconInfoCircle,
} from "@/sdk";
import { ChatGPTClient } from "./client";
import useSWR from "swr";
import { useMemo } from "react";
import useDebounce from "./useDebounce";

interface ChatGPTProps extends CommandHandlerProps {
  client: ChatGPTClient;
}

const ChatGPT: React.FC<ChatGPTProps> = ({ query, client }) => {
  const debouncedSearch = useDebounce(query, 1000);
  const { data, isLoading, error, isValidating } = useSWR(
    () => (debouncedSearch ? `/api/completion?query=${debouncedSearch}` : null),
    (q) => client.getCompletion(q),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      // revalidateIfStale: false,get
      // revalidateOnMount: false,
    }
  );

  const matchingExtension = useMemo(() => {
    if (!data) return null;
    return client.getMatchingExtension(data);
  }, [data, client]);

  const matchingCommand = useMemo(() => {
    if (!data || !matchingExtension) return null;
    return client.getMatchingCommand(data, matchingExtension);
  }, [data, client, matchingExtension]);

  console.log({
    query,
    data,
    isLoading,
    error,
    matchingExtension,
    matchingCommand,
    isValidating,
  });

  const Component = matchingCommand?.handler;

  return (
    <Detail isPending={isLoading || isValidating} isError={error}>
      <Box mih="35rem">
        {data?.message && (
          <Center p="lg" mx="auto">
            <Alert icon={<IconInfoCircle size="1rem" />} color="violet">
              {data?.message}
            </Alert>
          </Center>
        )}

        {Component && <Component query={query} />}
      </Box>
    </Detail>
  );
};

export default ChatGPT;
