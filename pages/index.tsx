import Searchbox from "@/components/Searchbox";
import { CoinGeckoExtension } from "@/integrations/coingecko";
import { EthGasStationExtension } from "@/integrations/ethgasstation";
import { useEffect, useMemo } from "react";
import { WalletButton } from "@/components/WalletButton";
import { anyTextValue, intentsBuilder, newPhrases } from "ecolect-parser";
import { en } from "ecolect-parser/language/en";
import { ParamType } from "@/sdk";

console.log({ en });

const Index = () => {
  const extensions = useMemo(() => {
    return [new CoinGeckoExtension(), new EthGasStationExtension()];
  }, []);

  useEffect(() => {
    extensions.forEach((extension) => extension.initialize?.());
  }, [extensions]);

  const intents = useMemo(() => {
    const getParamMatcher: Record<ParamType, any> = {
      Text: anyTextValue(),
    };

    const builder = intentsBuilder(en);

    extensions.forEach((extension) => {
      extension.commands.forEach((command) => {
        const commandName = `${extension.name}:${command.name}`;

        const phrases = newPhrases();
        if (command.params) {
          command.params.forEach((param) =>
            phrases.value(param.name, getParamMatcher[param.type])
          );
        }
        command.intents.forEach((intent) => phrases.phrase(intent));

        builder.add(commandName, phrases.build());
      });
    });

    return builder.build();
  }, [extensions]);

  return (
    <>
      <WalletButton />
      <Searchbox extensions={extensions} intents={intents} />
    </>
  );
};

export default Index;
