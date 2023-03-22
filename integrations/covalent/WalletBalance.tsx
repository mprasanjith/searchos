import {
  Box,
  CommandHandlerProps,
  createStyles,
  Detail,
  Group,
  IconArrowDownRight,
  IconArrowUpRight,
  rem,
  Text,
} from "@/sdk";
import { useEffect, useState } from "react";
import { CovalentClient, CovalentWalletBalanceResult } from "./client";
import { useAccount, useNetwork } from "wagmi";

interface WalletBalanceProps extends CommandHandlerProps {
  client: CovalentClient;
}

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const WalletBalance: any = ({ client, query }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [wallet, setWallet] = useState<CovalentWalletBalanceResult[] | null>(
    null
  );
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { classes } = useStyles();
  const chainName = client.getChainName(chain?.id);
  useEffect(() => {
    if (!query) return;

    setIsLoading(true);
    setWallet(null);

    let active = true;

    async function loadBalance() {
      const client = new CovalentClient();

      const result = await client.getWalletBalance({ chainName, address });
      console.log({ result });
      if (!result) return;

      if (active) {
        setWallet(result);
        setIsLoading(false);
      }
    }

    loadBalance();

    return () => {
      active = false;
      setIsLoading(false);
    };
  }, [query]);

  if (!wallet) return null;
  return wallet.map((token) => {
    console.log()
    return (
      <Detail
        isPending={isLoading}
        isError={!isLoading && !token}
        key={token.contract_name}
      >
        <Box>
          <Group>
            <Text size="xs" color="dimmed" className={classes.title}>
              {token?.contract_name.toUpperCase()} 
              {/* ({token?.contract_ticker_symbol?.toUpperCase()}) Price */}
            </Text>
          </Group>
        </Box>
      </Detail>
    );
  });
};

export default WalletBalance;
