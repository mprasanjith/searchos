import Searchbox from "@/components/Searchbox";
import { CoinGeckoExtension } from "@/integrations/coingecko";
import { EthGasStationExtension } from "@/integrations/ethgasstation";
import { useEffect, useMemo } from "react";
import { Container, Center } from "@mantine/core";
import { WalletButton } from "@/components/WalletButton";

const Index = () => {
  const extensions = useMemo(() => {
    return [new CoinGeckoExtension(), new EthGasStationExtension()];
  }, []);

  useEffect(() => {
    extensions.forEach((extension) => extension.initialize?.());
  }, [extensions]);

  return (
    <>
        <WalletButton />
        <Searchbox extensions={extensions} />
    </>
  );
};

export default Index;
