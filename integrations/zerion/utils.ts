const animalEmojis = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🦝",
  "🐻",
  "🐼",
  "🦘",
  "🦡",
  "🐨",
  "🐯",
  "🦁",
  "🦄",
  "🦓",
  "🦌",
  "🐮",
  "🐷",
  "🐽",
  "🐸",
  "🐵",
  "🦍",
  "🦧",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🦆",
  "🦢",
  "🦉",
  "🦩",
  "🦚",
  "🦜",
  "🐴",
  "🦄",
  "🐗",
  "🐺",
  "🦊",
  "🦝",
  "🐪",
  "🐫",
  "🦙",
  "🦒",
  "🦌",
  "🐘",
  "🦏",
  "🦛",
  "🐃",
  "🐄",
  "🐎",
  "🐖",
  "🐏",
  "🐑",
  "🦙",
  "🐐",
  "🦌",
  "🦃",
  "🐓",
  "🐩",
  "🦔",
  "🦇",
  "🐍",
  "🦕",
  "🦖",
  "🦎",
  "🦈",
  "🐙",
  "🦑",
  "🦐",
  "🦞",
  "🦀",
  "🐡",
  "🐠",
  "🐟",
  "🐬",
  "🐳",
  "🐋",
  "🦩",
  "🦩",
];

export function getWalletColor(
  walletAddress: `0x${string}` | null | undefined
): string {
  if (!walletAddress) return "white";
  const lastSixChars = walletAddress.slice(-6);
  const hexNumber = parseInt(lastSixChars, 16);
  const color = `#${hexNumber.toString(16).padStart(6, "0")}`;
  return color;
}

export function getWalletEmoji(
  walletAddress: `0x${string}` | null | undefined
): string {
  if (!walletAddress) return "👽";
  const lastSixChars = walletAddress.slice(-6);
  const hexNumber = parseInt(lastSixChars, 16);
  const emojiIndex = hexNumber % animalEmojis.length;
  const emoji = animalEmojis[emojiIndex];
  return emoji;
}

type BlockExplorers = {
  [key: string]: string;
};

export function getTransactionURL(
  chainName: string,
  transactionId: string
): string | null {
  const blockExplorers: BlockExplorers = {
    ethereum: "https://etherscan.io/tx",
    arbitrum: "https://arbiscan.io/tx",
    aurora: "https://explorer.mainnet.aurora.dev/tx",
    avalanche: "https://snowtrace.io/tx",
    binance: "https://bscscan.com/tx",
    fantom: "https://ftmscan.com/tx",
    optimism: "https://optimistic.etherscan.io/tx",
    polygon: "https://polygonscan.com/tx",
    solana: "https://explorer.solana.com/tx",
    gnosis: "https://gnosisscan.io/tx",
    xdai: "https://gnosisscan.io/tx"
  };

  const explorerURL = blockExplorers[chainName];

  if (!explorerURL) {
    return null
  }

  return `${explorerURL}/${transactionId}`;
}
