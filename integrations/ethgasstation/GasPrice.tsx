import {
  Alert,
  Box,
  CommandHandlerProps,
  Detail,
  IconAlertCircle,
  useNetwork,
} from "@/sdk";
import useSWR from "swr";
import { EthGasStationClient } from "./client";
import icon from "./icon.jpg";
import IconHeader from "@/sdk/templates/IconHeader";
import DetailsGrid from "@/sdk/templates/DetailsGrid";

interface TokenPriceProps {
  client: EthGasStationClient;
}

const GasPrice: React.FC<TokenPriceProps> = ({ client }) => {
  const { chain } = useNetwork();

  const { data: gasPrice, isLoading } = useSWR(
    "ethgasstation:get-gas-price",
    () => client.getGasPrice()
  );

  if (chain?.id !== 1) {
    return (
      <Alert
        icon={<IconAlertCircle size="1rem" />}
        title="Unsupported"
        color="red"
      >
        We do not currently support fetching gas prices for this network.
      </Alert>
    );
  }

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
