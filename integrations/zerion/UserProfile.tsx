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
  Card,
  Flex,
  Grid,
  Badge,
} from "@/sdk";
import useSWR from "swr";
import { useMemo } from "react";
import { ZerionClient } from "./client";
import { IconCopy, IconExternalLink } from "@/sdk";

interface UserProfileProps {
  client: ZerionClient;
  addressOrEns?: `0x${string}` | string | null;
}

export const UserProfile: React.FC<UserProfileProps> = ({
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

  const shortenedAddress = useMemo(() => {
    if (!resolvedAddress) return "";
    return `${resolvedAddress.slice(0, 6)}...${resolvedAddress.slice(-4)}`;
  }, [resolvedAddress]);


  return (
    <Detail isPending={isLoading} isError={error}>
      <Stack spacing="lg" m="md">
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          w={"auto"}
          h={"207px"}
          style={{
            backgroundColor: "#911919",
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
                🐙
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
                  <Text size={"lg"} color="white" weight={700}>
                    {shortenedAddress}
                  </Text>
                  <IconCopy color="white" size={"1rem"} fontWeight={700} />
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
        <Group position="apart">
          <Group spacing="md">
            <Avatar size="md" color="white">
              🔗
            </Avatar>

            <Box>
              <Text size="sm" truncate>
                hej
              </Text>
              <Text size="xs" color="dimmed" truncate>
                hejhej
              </Text>
            </Box>
          </Group>

          <Box ta="right">
            <IconExternalLink size="2rem" color="gray" />
          </Box>
        </Group>
      </Stack>
    </Detail>
  );
};

export default UserProfile;
