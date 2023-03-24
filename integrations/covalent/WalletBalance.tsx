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
import { useEffect, useMemo, useState } from "react";
import { CovalentClient, CovalentWalletBalanceResult } from "./client";
import IconHeader from "@/sdk/templates/IconHeader";

interface WalletBalanceProps extends CommandHandlerProps {
  client: CovalentClient;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ client }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [walletBalances, setWalletBalances] = useState<
    CovalentWalletBalanceResult[]
  >([]);

  const { address } = useAccount();
  const { chain } = useNetwork();
  const chainName = client.getChainName(chain?.id);

  const { data: ensName } = useEnsName({ address });

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);

    let active = true;

    async function loadBalance() {
      const result = await client.getWalletBalance({ chainName, address });
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
  }, [client, address, chainName]);

  const shortenedAddress = useMemo(() => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  return (
    <Detail isPending={isLoading} isError={isError}>
      <Stack spacing="lg" m="md">
        <IconHeader
          title={ensName || shortenedAddress}
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
                  <Avatar size="md" radius="xl" src={item.logo_url} color="dark">
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
