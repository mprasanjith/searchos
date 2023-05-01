import { CoinGeckoExtension } from "@/integrations/coingecko";
import { CovalentExtension } from "@/integrations/covalent";
import { ERC20TransferExtension } from "@/integrations/erc20transfer";
import { EthGasStationExtension } from "@/integrations/ethgasstation";
import { GitHubContributionsExtension } from "@/integrations/ghcontrib";
import { LensExtension } from "@/integrations/lens";
import { LiFiExtension } from "@/integrations/lifi";
import { OpenAIExtension } from "@/integrations/openai";
// import { ZerionExtension } from "@/integrations/zerion";

export const getExtensionsForGPT = () => {
  return [
    new ERC20TransferExtension(),
    new LiFiExtension(),
    new CoinGeckoExtension(),
    new EthGasStationExtension(),
    new CovalentExtension(),
    new LensExtension(),
    // new ZerionExtension()
  ];
};

export const getExtensions = () => {
  return [
    new OpenAIExtension(),
    new GitHubContributionsExtension(),
    ...getExtensionsForGPT(),
  ];
};
