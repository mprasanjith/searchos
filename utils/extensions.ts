import { CoinGeckoExtension } from "@/integrations/coingecko";
import { CovalentExtension } from "@/integrations/covalent";
import { ERC20TransferExtension } from "@/integrations/erc20transfer";
import { EthGasStationExtension } from "@/integrations/ethgasstation";
import { LiFiExtension } from "@/integrations/lifi";
import { OpenAIExtension } from "@/integrations/openai";

export const getExtensionsForGPT = () => {
  return [
    new ERC20TransferExtension(),
    new LiFiExtension(),
    new CoinGeckoExtension(),
    new EthGasStationExtension(),
    new CovalentExtension(),
  ];
};

export const getExtensions = () => {
  return [new OpenAIExtension(), ...getExtensionsForGPT()];
};
