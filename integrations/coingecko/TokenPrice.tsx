import {
  Box,
  createStyles,
  Detail,
  IconArrowDownRight,
  IconArrowUpRight,
  millify,
  Text,
} from "@/sdk";
import useSWR from "swr";
import { CoinGeckoClient } from "./client";
import IconHeader from "@/sdk/templates/IconHeader";
import DetailsGrid from "@/sdk/templates/DetailsGrid";
import { CoinGeckoTokenResult } from ".";

interface TokenPriceProps {
  client: CoinGeckoClient;
  token: CoinGeckoTokenResult;
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

const TokenPrice: React.FC<TokenPriceProps> = ({ client, token }) => {
  const { data: tokenData, isLoading } = useSWR(
    `coingecko:get-price:${token.symbol}`,
    () => (token?.symbol ? client.getTokenData(token.symbol) : null)
  );

  const { classes } = useStyles();

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
