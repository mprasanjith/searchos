import { Box, CommandHandlerProps, Detail } from "@/sdk";
import { useEffect, useState } from "react";
import { EthGasStationClient, EthGasStationResult } from "./client";
import icon from "./icon.png";
import IconHeader from "@/sdk/templates/IconHeader";
import DetailsGrid from "@/sdk/templates/DetailsGrid";

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
        <IconHeader title="Gas Price" subtitle="Ethereum" imageUrl={icon.src} />

        <DetailsGrid
          details={{
            Fast: gasPrice?.fast
              ? `${gasPrice?.fast / 10} (~${gasPrice?.fastWait}min)`
              : "",
            Standard: gasPrice?.average
              ? `${gasPrice?.average / 10} (~${gasPrice?.avgWait}min)`
              : "",
            "Safe Low": gasPrice?.safeLow
              ? `${gasPrice?.safeLow / 10} (~${gasPrice?.safeLowWait}min)`
              : "",
          }}
        />
      </Box>
    </Detail>
  );
};

export default GasPrice;
