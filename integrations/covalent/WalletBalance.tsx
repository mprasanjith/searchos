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
  useAccount,
  useNetwork,
  Alert,
  IconAlertCircle,
} from "@/sdk";
import useSWR from "swr";
import { useMemo } from "react";
import { CovalentClient } from "./client";
import IconHeader from "@/sdk/templates/IconHeader";

interface WalletBalanceProps {
  client: CovalentClient;
  addressOrEns?: `0x${string}` | string | null;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  client,
  addressOrEns,
}) => {
  const { chain } = useNetwork();
  const { address: userAddress } = useAccount();
  const addressToUse = addressOrEns || userAddress;

  const { data: address } = useEnsAddress({
    name: addressToUse,
    enabled: addressToUse?.endsWith(".eth"),
    chainId: 1,
  });

  const { data: ensName } = useEnsName({
    address: addressToUse as `0x${string}`,
    enabled: addressToUse?.startsWith("0x"),
    chainId: 1,
  });

  const resolvedEnsName = useMemo(
    () => (addressToUse?.endsWith(`.eth`) ? addressToUse : ensName),
    [ensName, addressToUse]
  );
  const resolvedAddress = useMemo(
    () =>
      addressToUse?.startsWith(`0x`)
        ? (addressToUse as `0x${string}`)
        : address,
    [addressToUse, address]
  );

  const {
    data: walletBalances,
    isLoading,
    error,
  } = useSWR(
    `covalent:get-wallet-balance:${chain?.id || 1}:${resolvedAddress}`,
    async () =>
      resolvedAddress
        ? await client.getWalletBalance({
            chainId: chain?.id || 1,
            address: resolvedAddress,
          })
        : null
  );

  const shortenedAddress = useMemo(() => {
    if (!resolvedAddress) return "";
    return `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`;
  }, [resolvedAddress]);

  if (chain?.id === 100) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Unsupported"
        color="red"
      >
        Covalent does not support Gnosis Chain at the moment.
      </Alert>
    );
  }

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
