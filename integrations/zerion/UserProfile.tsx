import {
  Detail,
  Group,
  Stack,
  Text,
  useEnsName,
  useEnsAddress,
  useAccount,
  useNetwork,
  Card,
  Flex,
  Grid,
  Badge,
  Box
} from "@/sdk";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { ZerionClient } from "./client";
import { IconCopy } from "@/sdk";
import { TransactionRow } from "./TransactionRow";
import { getWalletColor, getWalletEmoji } from "./utils";
interface UserProfileProps {
  client: ZerionClient;
  addressOrEns?: `0x${string}` | string | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  client,
  addressOrEns,
}) => {
    const [active, setActive] = useState(false)
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
    data: walletBalance,
    isLoading,
    error,
  } = useSWR(
    `zerion:get-wallet-balance:${chain?.id || 1}:${resolvedAddress}`,
    async () =>
      resolvedAddress
        ? await client.getWalletBalance({
            address: resolvedAddress,
          })
        : null
  );

  const { data: walletTransactions } = useSWR(
    `zerion:get-wallet-transactions:${chain?.id || 1}:${resolvedAddress}`,
    async () =>
      resolvedAddress
        ? await client.getWalletTransactions({
            address: resolvedAddress,
          })
        : null
  );

  const shortenedAddress = useMemo(() => {
    if (!resolvedAddress) return "";
    return `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`;
  }, [resolvedAddress]);

  if(!walletTransactions || walletTransactions.length === 0) {
    return null
  }
  const copyToClipBoard = () => {
    navigator.clipboard.writeText(resolvedAddress ?? "")
    setActive(true)
    setTimeout(() => {
        setActive(false)
    }, 2000);
  }
  return (
    <Detail isPending={isLoading} isError={error}>
      <Stack spacing="lg" m="md">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          w={"354px"}
          h={"207px"}
          style={{
            backgroundColor: getWalletColor(resolvedAddress),
          }}
        >
          <Card.Section>
            <Grid>
              <Grid.Col
                style={{
                  fontSize: "3rem",
                  position: "absolute",
                  top: -10,
                  left: 10,
                }}
                span={6}
              >
                {getWalletEmoji(resolvedAddress)}
              </Grid.Col>
              <Grid.Col
                span={6}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <Group>
                    <Flex onClick={copyToClipBoard} style={{
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                  <Text size={"lg"} color="white" weight={700} style={{
                    marginRight: "0.5rem"
                  }}>
                    {active ? "Copied" : shortenedAddress}
                  </Text>
                  {active ? "✅" : <IconCopy color="white" size={"1rem"} fontWeight={700}/>}
                  </Flex>
                </Group>
              </Grid.Col>
              <Grid.Col
                span={6}
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                }}
              >
                <Flex direction="column">
                  <Text size="xl" mt="xs" color="white" weight={700}>
                    {resolvedEnsName || shortenedAddress}
                  </Text>

                  <Text
                    size="sm"
                    weight={700}
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {`$ ${walletBalance}`}
                  </Text>
                </Flex>
              </Grid.Col>
              <Grid.Col
                span={6}
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                }}
              >
                <Badge
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                  }}
                >
                  <Text
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {chain?.name}
                  </Text>
                </Badge>
              </Grid.Col>
            </Grid>
          </Card.Section>
        </Card>
        <Text size="lg" weight="bold">
          Key Events
        </Text>
        
        {walletTransactions.map((tx, key) => (
          <TransactionRow index={key} tx={tx} key={key} />
        ))
        }
      </Stack>
    </Detail>
  );
};

export default UserProfile;
