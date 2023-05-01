import Link from "next/link";
import { Group, Box, Avatar, Text } from "@/sdk";
import { HiArrowUpRight } from "react-icons/hi2";
import { WalletTransactionsData } from "./types";
import { getTransactionURL } from "./utils";

export const TransactionRow = ({
  tx,
  index,
}: {
  tx: WalletTransactionsData;
  index: number;
}) => {
  // Check if the transaction is of type "receive" and has a value.
  const shouldRender =
    tx.attributes.operation_type !== "receive" ||
    tx.attributes.transfers.some((transfer) => transfer.value > 0);

  // If the transaction is of type "receive" and doesn't have a value, do not render it.
  if (!shouldRender) {
    return null;
  }
  const getActionDetails = (transactionType: string) => {
    switch (transactionType) {
      case "receive":
        const receiveTransfer = tx.attributes.transfers[0];
        return {
          emoji: "📥",
          category: "Received",
          description: `${receiveTransfer.quantity.float.toFixed(2)} ${
            receiveTransfer.fungible_info?.symbol
          }`,
          color: "green",
        };
      case "trade":
        const tradeTransfer = tx.attributes.transfers[0];
        return {
          emoji: "🔄",
          category: "Trade",
          description: `${tradeTransfer.quantity.float.toFixed(2)} ${
            tradeTransfer.fungible_info?.symbol
          }`,
          color: "indigo",
        };
      case "approve":
        const approveTransfer = tx.attributes.approvals[0];
        return {
          emoji: "✅",
          category: "Approve",
          description: `${approveTransfer.quantity.float.toFixed(2)} ${
            approveTransfer.fungible_info?.symbol
          }`,
          color: "blue",
        };
      case "burn":
        const burnTransfer = tx.attributes.transfers[0];
        return {
          emoji: "🔥",
          category: "Burn",
          description: `${burnTransfer.quantity.float.toFixed(2)} ${
            burnTransfer.fungible_info?.symbol
          }`,
          color: "red",
        };
      case "mint":
        const mintTransfer = tx.attributes.transfers[0];
        return {
          emoji: "💰",
          category: "Mint",
          description: `${mintTransfer.quantity.float.toFixed(2)} ${
            mintTransfer.nft_info?.name
          }`,
          color: "lime",
        };
      case "withdraw":
        const withdrawTransfer = tx.attributes.transfers[0];
        return {
          emoji: "💼",
          category: "Withdraw",
          description: `${withdrawTransfer.quantity.float.toFixed(2)} ${
            withdrawTransfer.fungible_info?.symbol
          }`,
          color: "orange",
        };
      case "send":
        const sendTransfer = tx.attributes.transfers[0];
        return {
          emoji: "💸",
          category: "Sent",
          description: `${sendTransfer.quantity.float.toFixed(2)} ${
            sendTransfer.fungible_info?.symbol
          }`,
          color: "teal",
        };
      case "stake":
        const stakeTransfer = tx.attributes.transfers[0];
        return {
          emoji: "🔒",
          category: "Stake",
          description: `${stakeTransfer.quantity.float.toFixed(2)} ${
            stakeTransfer.fungible_info?.symbol
          }`,
          color: "cyan",
        };
      default:
        return {
          color: "gray",
          emoji: "❓",
          category: "Unknown",
          description: "Unknown action",
        };
    }
  };

  const { color, emoji, category, description } = getActionDetails(
    tx.attributes.operation_type
  );

  const chainId =
    tx.relationships.chain.data.id.toLowerCase()
  const blockExplorerUrl = getTransactionURL(chainId, tx.attributes.hash);

  return (
    <Group key={index} position="apart">
      <Group spacing="md">
        <Avatar size="md" color={color}>
          {emoji}
        </Avatar>
        <Box>
          <Text size="sm" color="#C5C4C5" weight={700} truncate>
            {category}
          </Text>
          <Text size="md" color="black" weight={700} truncate>
            {description}
          </Text>
        </Box>
      </Group>
      <Box ta="right">
        <Link href={blockExplorerUrl ?? ""} target="_blank" rel="noopener noreferrer">
          <HiArrowUpRight
            size={"2rem"}
            color="#C5C4C5"
            style={{
              transform: "translate(-0.5rem, 0.75rem)",
            }}
          />
        </Link>
      </Box>
    </Group>
  );
};
