import {
  Box,
  CommandHandlerProps,
  Detail,
  Group,
  Text,
  Avatar,
  Flex,
  Stack,
  Button,
} from "@/sdk";
import { useEffect, useState } from "react";
import { EthGasStationClient, EthGasStationResult } from "./client";
import icon from "./icon.png";

interface TokenPriceProps extends CommandHandlerProps {}

const GasPrice: React.FC<TokenPriceProps> = ({ query }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gasPrice, setGasPrice] = useState<EthGasStationResult | null>(null);

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setGasPrice(null);

    let active = true;

    async function loadGasPrice() {
      const client = new EthGasStationClient();
      const result = await client.getGasPrice();
      if (!result) return;

      if (active) {
        setGasPrice(result);
        setIsLoading(false);
      }
    }

    loadGasPrice();

    return () => {
      active = false;
      setIsLoading(false);
    };
  }, [query]);

  return (
    <Detail isPending={isLoading} isError={!isLoading && !gasPrice}>
      <Box>
        <Flex
          p="md"
          justify="center"
          direction="column"
          align="center"
          sx={(theme) => ({
            borderBottom: `1px solid ${theme.colors.gray[1]}`,
          })}
        >
          <Avatar src={icon.src} radius="xl" size="lg" />

          <Text size="xl" mt="xs">
            Gas Price
          </Text>

          <Text size="sm" color="dimmed">
            Ethereum
          </Text>
        </Flex>

        <Flex
          m="lg"
          gap="xs"
          direction="column"
          sx={{ fontSize: "0.96rem", gap: "0.26rem" }}
        >
          {gasPrice?.fast && (
            <Group align="flex-end" spacing="xs">
              <Text w="6rem" color="dimmed">
                Fast
              </Text>
              <Text>
                {gasPrice?.fast / 10} (~{gasPrice?.fastWait}min)
              </Text>
            </Group>
          )}
          {gasPrice?.average && (
            <Group align="flex-end" spacing="xs">
              <Text w="6rem" color="dimmed">
                Standard
              </Text>
              <Text>
                {gasPrice?.average / 10} (~{gasPrice?.avgWait}min)
              </Text>
            </Group>
          )}
          {gasPrice?.safeLow && (
            <Group align="flex-end" spacing="xs">
              <Text w="6rem" color="dimmed">
                Safe Low
              </Text>
              <Text>
                {gasPrice?.safeLow / 10} (~{gasPrice?.safeLowWait}min)
              </Text>
            </Group>
          )}
        </Flex>
      </Box>
    </Detail>
  );
};

export default GasPrice;
