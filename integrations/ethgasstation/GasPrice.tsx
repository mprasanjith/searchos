import {
  Box,
  CommandHandlerProps,
  createStyles,
  Detail,
  Group,
  rem,
  Text,
} from "@/sdk";
import { useEffect, useState } from "react";
import { EthGasStationClient, EthGasStationResult } from "./client";

interface TokenPriceProps extends CommandHandlerProps {}

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const GasPrice: React.FC<TokenPriceProps> = ({ query }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gasPrice, setGasPrice] = useState<EthGasStationResult | null>(null);

  const { classes } = useStyles();

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
        <Group>
          <Text size="xs" color="dimmed" className={classes.title}>
            Gas Price
          </Text>
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{gasPrice?.average}</Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Average gas price right now
        </Text>
      </Box>
    </Detail>
  );
};

export default GasPrice;
