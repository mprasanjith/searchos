import {
  Box,
  CommandHandlerProps,
  createStyles,
  Detail,
  IconArrowDownRight,
  IconArrowUpRight,
  millify,
  Text,
} from "@/sdk";
import { useEffect, useState } from "react";
import { CoinGeckoTokenDataResult, CoinGeckoTokenResult } from ".";
import { CoinGeckoClient } from "./client";
import IconHeader from "@/sdk/templates/IconHeader";
import DetailsGrid from "@/sdk/templates/DetailsGrid";

interface TokenPriceProps extends CommandHandlerProps {
  client: CoinGeckoClient;
}

const useStyles = createStyles(() => ({
  content: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
  },
}));

const TokenPrice: React.FC<TokenPriceProps> = ({ client, query }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<CoinGeckoTokenResult | null>(null);
  const [tokenData, setTokenData] = useState<CoinGeckoTokenDataResult | null>(
    null
  );

  const { classes } = useStyles();

  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setToken(null);
    setTokenData(null);

    let active = true;

    async function loadQuote() {
      const match = client.findTokenMatch(query);
      if (!match) return;

      const tokenData = await client.getTokenData(match.id);

      if (active) {
        setToken(match);
        setTokenData(tokenData);
        setIsLoading(false);
      }
    }

    loadQuote();

    return () => {
      active = false;
      setIsLoading(false);
    };
  }, [query, client]);

  const isGain = (tokenData?.market_data?.price_change_percentage_24h || 0) > 0;
  const DiffIcon = isGain ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Detail isPending={isLoading} isError={!isLoading && !token}>
      <Box>
        <IconHeader
          title={token?.symbol?.toUpperCase()}
          subtitle={token?.name}
          imageUrl={tokenData?.image?.large}
        />

        <DetailsGrid
          details={{
            Price: (
              <div className={classes.content}>
                <Text>${tokenData?.market_data.current_price.usd}</Text>
                <Text color={isGain ? "teal" : "red"} fz="sm" fw={500}>
                  <span>
                    {tokenData?.market_data?.price_change_percentage_24h || "-"}
                    %
                  </span>
                  <DiffIcon size="1rem" stroke={1.5} />
                </Text>
              </div>
            ),
            Volume: tokenData?.market_data.total_volume.usd
              ? `$${millify(tokenData?.market_data.total_volume.usd)}`
              : "-",
            "Market Cap": tokenData?.market_data.market_cap.usd
              ? `$${millify(tokenData?.market_data?.market_cap.usd)}`
              : "-",
          }}
        />
      </Box>
    </Detail>
  );
};

export default TokenPrice;
