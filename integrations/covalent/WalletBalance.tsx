import {
  Avatar,
  Box,
  CommandHandlerProps,
  Detail,
  Group,
  Stack,
  Text,
  useAccount,
  useEnsName,
  useNetwork,
  ethers,
} from "@/sdk";
import { useEffect, useMemo, useState, useRef } from "react";
import { CovalentClient, CovalentWalletBalanceResult } from "./client";
import IconHeader from "@/sdk/templates/IconHeader";
import { match } from "./keywords";

interface WalletBalanceProps extends CommandHandlerProps {
  client: CovalentClient;
  query: `0x${string}`;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ client, query }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [walletBalances, setWalletBalances] = useState<
    CovalentWalletBalanceResult[]
  >([]);
  const queryRef = useRef(query);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainId = chain?.id;
  const { data: ensName } = useEnsName({
    address: queryRef.current,
    enabled: queryRef.current.startsWith("0x"),
  });

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    let active = true;

    function replaceQuery() {
      if (address) {
        queryRef.current = address;
      }
    }

    async function loadBalance() {
      if (match(query)) {
        replaceQuery();
      }
      const result = await client.getWalletBalance({ chainId, address: queryRef.current });

      if (active) {
        !result ? setIsError(true) : setWalletBalances(result);
        setIsLoading(false);
      }
    }

    loadBalance();

    return () => {
      active = false;
      setIsError(false);
      setIsLoading(false);
    };
  }, [client, query, chainId, address]);

  const shortenedAddress = useMemo(() => {
    if (!query) return "";
    if (queryRef.current.startsWith("0x") || match(queryRef.current)) {
      return `${queryRef.current.slice(0, 6)}...${queryRef.current.slice(-4)}`;
    }
  }, [query]);

  return (
    <Detail isPending={isLoading} isError={isError}>
      <Stack spacing="lg" m="md">
        <IconHeader
          title={ensName || shortenedAddress || query}
          subtitle="Ethereum"
          imageUrl={
            ensName
              ? `https://metadata.ens.domains/mainnet/avatar/${ensName}`
              : undefined
          }
        />

        {walletBalances
          .filter((token) => !!token.contract_name)
          .map((item, key) => {
            const tokenAmount = Number.parseFloat(
              ethers.utils.formatUnits(item.balance, item.contract_decimals)
            );
            const change = (item.quote - item.quote_24h) / 100;

            if (!tokenAmount) return null;
            return (
              <Group key={key} position="apart">
                <Group spacing="md">
                  <Avatar
                    size="md"
                    radius="xl"
                    src={item.logo_url}
                    color="dark"
                  >
                    {item?.contract_ticker_symbol}
                  </Avatar>

                  <Box>
                    <Text size="sm" truncate>
                      {`${tokenAmount.toFixed(4)} ${
                        item?.contract_ticker_symbol
                      }`}
                    </Text>
                    <Text size="xs" color="dimmed" truncate>
                      {item?.contract_name}
                    </Text>
                  </Box>
                </Group>

                <Box ta="right">
                  <Text>${item?.quote}</Text>
                  <Text size="xs" color="dimmed">
                    {change ? `${change.toFixed(2)}%` : ""}
                  </Text>
                </Box>
              </Group>
            );
          })}
      </Stack>
    </Detail>
  );
};

export default WalletBalance;
