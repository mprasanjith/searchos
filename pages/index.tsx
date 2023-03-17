import Searchbox from "@/components/Searchbox";
import { CoinGeckoExtension } from "@/integrations/coingecko";
import { useEffect, useMemo } from "react";

const Index = () => {
  const extensions = useMemo(() => {
    return [new CoinGeckoExtension()];
  }, []);

  useEffect(() => {
    extensions.forEach((extension) => extension.initialize?.());
  }, [extensions]);

  return <Searchbox extensions={extensions} />;
};

export default Index;
