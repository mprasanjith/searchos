import { Box, CommandHandlerProps, Detail } from "@/sdk";
import useSWR from "swr";
import { EthGasStationClient } from "./client";
import icon from "./icon.jpg";
import IconHeader from "@/sdk/templates/IconHeader";
import DetailsGrid from "@/sdk/templates/DetailsGrid";

interface TokenPriceProps extends CommandHandlerProps {
  client: EthGasStationClient;
}

const GasPrice: React.FC<TokenPriceProps> = ({ client }) => {
  const { data: gasPrice, isLoading } = useSWR(
    "ethgasstation:get-gas-price",
    () => client.getGasPrice()
  );

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
