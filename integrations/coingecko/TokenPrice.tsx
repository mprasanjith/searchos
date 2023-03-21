import {
  Box,
  CommandHandlerProps,
  createStyles,
  Detail,
  Group,
  IconArrowDownRight,
  IconArrowUpRight,
  rem,
  Text,
} from "@/sdk";
import { useEffect, useState } from "react";
import { CoinGeckoPriceResult, CoinGeckoTokenResult } from ".";
import { CoinGeckoClient } from "./client";

interface TokenPriceProps {
  client: CoinGeckoClient;
  query: string;
}

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

const TokenPrice: React.FC<TokenPriceProps> = ({ client, query }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<CoinGeckoTokenResult | null>(null);
  const [price, setPrice] = useState<CoinGeckoPriceResult | null>(null);

  const { classes } = useStyles();

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setToken(null);
    setPrice(null);

    let active = true;

    async function loadQuote() {
      const match = client.findTokenMatch(query);
      if (!match) return;

      const price = await client.getPrice(match.id);

      if (active) {
        setToken(match);
        setPrice(price);
        setIsLoading(false);
      }
    }

    loadQuote();

    return () => {
      active = false;
      setIsLoading(false);
    };
  }, [query, client]);

  const isGain = (price?.usd_24h_change || 0) > 0;
  const DiffIcon = isGain ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Detail isPending={isLoading} isError={!isLoading && !token}>
      <Box>
        <Group>
          <Text size="xs" color="dimmed" className={classes.title}>
            {token?.name.toUpperCase()} ({token?.symbol?.toUpperCase()}) Price
          </Text>
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>${price?.usd}</Text>
          <Text
            color={isGain ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>
              {price?.usd_24h_change
                ? price?.usd_24h_change.toPrecision(2)
                : ""}
              %
            </span>
            <DiffIcon size="1rem" stroke={1.5} />
          </Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          Compared to previous day
        </Text>
      </Box>
    </Detail>
  );
};

export default TokenPrice;
