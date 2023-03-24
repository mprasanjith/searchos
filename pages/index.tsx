import Searchbox from "@/components/Searchbox";
import { CoinGeckoExtension } from "@/integrations/coingecko";
import { EthGasStationExtension } from "@/integrations/ethgasstation";
import { CovalentExtension } from "@/integrations/covalent";
import { useEffect, useMemo } from "react";
import { WalletButton } from "@/components/WalletButton";
import { ERC20TransferExtension } from "@/integrations/erc20transfer";
import { LiFiExtension } from "@/integrations/lifi";

const Index = () => {
  const extensions = useMemo(() => {
    return [
      new ERC20TransferExtension(),
      new LiFiExtension(),
      new CoinGeckoExtension(),
      new EthGasStationExtension(),
      new CovalentExtension(),
    ];
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
