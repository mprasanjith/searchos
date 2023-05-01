import { Group, Box, Avatar, Text } from "@/sdk";
import { HiArrowUpRight } from "react-icons/hi2";
import { WalletTransactionsData } from "./types";

export const TransactionRow = ({
  tx,
  index,
}: {
  tx: WalletTransactionsData;
  index: number;
}) => {
  const getActionDetails = (transactionType: string) => {
    switch (transactionType) {
      case "receive":
        return {
          emoji: "📥",
          category: "Received",
          description: "Received tokens",
          color: "green",
        };
      case "trade":
        return {
          emoji: "🔄",
          category: "Trade",
          description: "Traded tokens",
          color: "indigo",
        };
      case "approve":
        return {
          emoji: "✅",
          category: "Approve",
          description: "Approved tokens",
          color: "blue",
        };
      case "burn":
        return {
          emoji: "🔥",
          category: "Burn",
          description: "Burned tokens",
          color: "red",
        };
      case "mint":
        return {
          emoji: "💰",
          category: "Mint",
          description: "Minted tokens",
          color: "lime",
        };
      case "withdraw":
        return {
          emoji: "💼",
          category: "Withdraw",
          description: "Withdrew tokens",
          color: "orange",
        };
      case "send":
        return {
          emoji: "📤",
          category: "Sent",
          description: "Sent tokens",
          color: "teal",
        };
      case "stake":
        return {
          emoji: "🔒",
          category: "Stake",
          description: "Staked tokens",
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
        <HiArrowUpRight size={"2rem"} color="#C5C4C5" />
      </Box>
    </Group>
  );
};
