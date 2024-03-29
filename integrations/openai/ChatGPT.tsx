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
import { useContext, useMemo } from "react";
import useDebounce from "./useDebounce";
import { ExtensionsContext } from "@/components/ExtensionsProvider";

interface ChatGPTProps extends CommandHandlerProps {
  client: ChatGPTClient;
}

const ChatGPT: React.FC<ChatGPTProps> = ({ query, client, chainId }) => {
  const { getMatchingCommand, getMatchingExtension } =
    useContext(ExtensionsContext);

  const debouncedSearch = useDebounce(query, 1000);
  const { data, isLoading, error, isValidating } = useSWR(
    () => (debouncedSearch ? `/api/completion?query=${debouncedSearch}` : null),
    (q) => client.getCompletion(q),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const matchingExtension = useMemo(() => {
    if (!data?.extension) return null;
    return getMatchingExtension(data.extension);
  }, [data, getMatchingExtension]);

  const matchingCommand = useMemo(() => {
    if (!data?.command || !matchingExtension) return null;
    return getMatchingCommand(matchingExtension, data.command);
  }, [data, matchingExtension, getMatchingCommand]);

  const Component = matchingCommand?.handler;

  return (
    <Detail isPending={isLoading || isValidating} isError={error}>
      <Box>
        {data?.message && (
          <Center p="lg" mx="auto">
            <Alert icon={<IconInfoCircle size="1rem" />} color="violet">
              {data?.message}
            </Alert>
          </Center>
        )}

        {Component ? (
          <Component
            query={query}
            assistantQuery={data?.query}
            chainId={chainId}
          />
        ) : (
          <Center p="lg" mx="auto">
            <Alert icon={<IconInfoCircle size="1rem" />} color="violet">
              Sorry, I didn&apos;t understand that.
            </Alert>
          </Center>
        )}
      </Box>
    </Detail>
  );
};

export default ChatGPT;
