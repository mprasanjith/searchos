import Searchbox from "@/components/Searchbox";
import { useEffect, useMemo } from "react";
import { WalletButton } from "@/components/WalletButton";
import { getExtensions } from "@/utils/extensions";

const Index = () => {
  const extensions = useMemo(() => getExtensions(), []);

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
