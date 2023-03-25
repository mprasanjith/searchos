import {
  Avatar,
  Box,
  Detail,
  Group,
  Stack,
  Text,
  useEnsName,
  ethers,
  useEnsAddress,
} from "@/sdk";
import useSWR from "swr";
import { useMemo } from "react";
import { CovalentClient } from "./client";
import IconHeader from "@/sdk/templates/IconHeader";

interface WalletBalanceProps {
  client: CovalentClient;
  addressOrEns: `0x${string}` | string;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  client,
  addressOrEns,
}) => {
  const { data: address } = useEnsAddress({
    name: addressOrEns,
    enabled: addressOrEns.endsWith(".eth"),
  });

  const { data: ensName } = useEnsName({
    address: addressOrEns as `0x${string}`,
    enabled: addressOrEns.startsWith("0x"),
  });

  const resolvedEnsName = useMemo(
    () => (addressOrEns.endsWith(`.eth`) ? addressOrEns : ensName),
    [addressOrEns, ensName]
  );
  const resolvedAddress = useMemo(
    () =>
      addressOrEns.startsWith(`0x`) ? (addressOrEns as `0x${string}`) : address,
    [addressOrEns, address]
  );

  const {
    data: walletBalances,
    isLoading,
    error,
  } = useSWR(`covalent:get-wallet-balance:${resolvedAddress}`, async () =>
    resolvedAddress
      ? await client.getWalletBalance({
          chainId: 1,
          address: resolvedAddress,
        })
      : null
  );

  const shortenedAddress = useMemo(() => {
    if (!resolvedAddress) return "";
    return `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`;
  }, [resolvedAddress]);

  return (
    <Detail isPending={isLoading} isError={error}>
      <Stack spacing="lg" m="md">
        <IconHeader
          title={resolvedEnsName || shortenedAddress}
          subtitle="Ethereum"
          imageUrl={
            resolvedEnsName
              ? `https://metadata.ens.domains/mainnet/avatar/${resolvedEnsName}`
              : undefined
          }
        />

        {walletBalances
          ?.filter((token) => !!token.contract_name)
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
