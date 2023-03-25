import {
  Box,
  Detail,
  Autocomplete,
  TextInput,
  useForm,
  Flex,
  Button,
  SelectItemProps,
  Text,
  Avatar,
  Group,
  ethers,
  useEnsAddress,
  usePrepareContractWrite,
  erc20ABI,
  useContractWrite,
  useBalance,
  Alert,
  IconAlertCircle,
  useAccount,
  useEnsName,
} from "@/sdk";
import TextHeader from "@/sdk/templates/TextHeader";
import { forwardRef, useMemo } from "react";
import { ERC20TransferParams } from ".";
import { TokenListToken } from "@/sdk/helpers/tokens";

type ItemProps = SelectItemProps & TokenListToken;

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ value, name, symbol, logoURI, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Avatar size="sm" src={logoURI} />

        <div>
          <Text weight="bolder" truncate>
            {symbol}
          </Text>
          <Text size="xs" color="dimmed" truncate>
            {name}
          </Text>
        </div>
      </Group>
    </div>
  )
);

SelectItem.displayName = "AutoCompleteItem";

interface ERC20TransferProps {
  params: ERC20TransferParams;
  tokenList: TokenListToken[];
}

const ERC20Transfer: React.FC<ERC20TransferProps> = ({
  params,
  tokenList: tokens,
}) => {
  const parsedParams = useMemo(() => {
    return {
      address: params.receiverAddress || "",
      amount: params.sendAmount || "1",
      token: params.token || "",
    };
  }, [params]);

  const form = useForm({
    initialValues: parsedParams,
    validate: {
      address: (value) => {
        let isAddress = false;
        try {
          isAddress = ethers.utils.isAddress(value);
        } catch (e) {
          isAddress = false;
        }
        const isENS = value.endsWith(".eth");

        return isAddress || isENS ? null : "Invalid address";
      },
      amount: (value, values) => {
        const token = tokens.find((item) => item.symbol === values.token);
        if (!token) return null;

        try {
          ethers.utils.parseUnits(value, token.decimals);
        } catch {
          return "Invalid amount";
        }
      },
    },
  });

  const { data: resolvedAddress } = useEnsAddress({
    name: form.values.address,
    enabled: form.values.address.endsWith(".eth"),
    chainId: 1,
  });

  const token = useMemo(() => {
    return tokens.find((item) => item.symbol === form.values.token);
  }, [tokens, form.values.token]);

  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address, chainId: 1 });
  const { data: tokenBalance } = useBalance({
    enabled: !!token,
    token: token?.address as `0x${string}`,
    address,
  });

  const resolvedParams = useMemo(() => {
    if (!token || !tokenBalance) return null;

    const tokenAddress = token.address as `0x${string}`;

    const values = form.values;
    const isENS = values.address.endsWith(".eth");
    let receiverAddress;
    if (isENS) {
      if (!resolvedAddress) return null;
      receiverAddress = resolvedAddress;
    } else {
      receiverAddress = values.address as `0x${string}`;
    }

    let amount;
    try {
      amount = ethers.utils.parseUnits(values.amount, token.decimals);
    } catch (e) {
      return null;
    }

    return {
      tokenAddress,
      receiverAddress,
      amount,
    };
  }, [resolvedAddress, form.values, token, tokenBalance]);

  const { config: transferConfig, error } = usePrepareContractWrite({
    enabled: !!resolvedParams,
    address: resolvedParams?.tokenAddress,
    abi: erc20ABI,
    functionName: "transfer",
    args: resolvedParams
      ? [resolvedParams.receiverAddress, resolvedParams.amount]
      : undefined,
  });

  const { write } = useContractWrite(transferConfig);

  const isTokenBalanceSufficient = useMemo(() => {
    if (!resolvedParams || !tokenBalance) return false;
    return tokenBalance.value?.gte(resolvedParams.amount);
  }, [resolvedParams, tokenBalance]);

  const onSubmit = () => {
    write?.();
  };

  return (
    <Detail isError={false} isPending={false}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Box mih="35rem">
          <TextHeader
            title="Send Tokens"
            subtitle={`from ${ensName || "your wallet"}`}
          />
          <Box m="xl">
            <TextInput
              label="Wallet address"
              placeholder="Enter wallet address"
              {...form.getInputProps("address")}
            />

            <Autocomplete
              mt="md"
              label="Token"
              placeholder="Token"
              nothingFound="No token found"
              data={tokens.map((item) => ({
                value: item.symbol,
                ...item,
              }))}
              itemComponent={SelectItem}
              onClick={() => form.setFieldValue("token", "")}
              filter={(value, item) =>
                `${item.address} ${item.name} ${item.symbol}`
                  .toLowerCase()
                  .includes(value.toLowerCase().trim())
              }
              {...form.getInputProps("token")}
            />

            <TextInput
              mt="md"
              label="Amount"
              placeholder="Enter amount"
              description={
                form.values.token && tokenBalance
                  ? `Balance: ${tokenBalance.formatted}`
                  : ""
              }
              {...form.getInputProps("amount")}
            />
          </Box>

          <Flex m="md">
            <Button
              disabled={!write}
              type="submit"
              fullWidth
              variant="filled"
              color="dark.4"
            >
              Transfer tokens
            </Button>
          </Flex>

          {error && (
            <Flex m="md">
              <Alert
                icon={<IconAlertCircle size="1rem" />}
                title="Bummer!"
                color="red"
                sx={{ width: "100%" }}
              >
                {!isTokenBalanceSufficient
                  ? "Token balance not sufficient."
                  : "Check whether you have a sufficient token balance or gas."}
              </Alert>
            </Flex>
          )}
        </Box>
      </form>
    </Detail>
  );
};

export default ERC20Transfer;
