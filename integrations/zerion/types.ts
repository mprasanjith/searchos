export type WalletPortfolioResponse = {
  links: {
    self: string;
  };
  data: {
    type: string;
    id: string; // Portfolio unique ID
    attributes: {
      positions_distribution_by_type: {
        wallet: number;
        deposited: number;
        borrowed: number;
        locked: number;
        staked: number;
      };
      positions_distribution_by_chain: {
        arbitrum: number;
        aurora: number;
        avalanche: number;
        binance_smart_chain: number;
        ethereum: number;
        fantom: number;
        loopring: number;
        optimism: number;
        polygon: number;
        solana: number;
        xdai: number;
      };
      total: {
        positions: number;
      };
      changes: {
        absolute_1d: number;
        percent_1d: number;
      };
    };
  };
};

type Icon = {
  url: string;
};

type Flags = {
  verified: boolean;
};

type FungibleInfo = {
  name: string;
  symbol: string;
  description: string;
  icon: Icon;
  flags: Flags;
  implementations: Array<{
    chain_id: string;
    address: string;
    decimals: number;
  }>;
};

type Content = {
  preview?: {
    url: string;
    content_type: string;
  };
  detail?: {
    url: string;
    content_type: string;
  };
  audio?: {
    url: string;
    content_type: string;
  };
  video?: {
    url: string;
    content_type: string;
  };
};

type NFTInfo = {
  contract_address: string;
  token_id: string;
  name: string;
  interface: string;
  content: Content;
};

type Quantity = {
  int: string;
  decimals: number;
  float: number;
  numeric: string;
};

export type WalletTransactionsData = {
  type: string;
  id: string; // Unique ID of the transaction.
  attributes: {
    operation_type: string;
    hash: string;
    mined_at_block: number;
    mined_at: string;
    sent_from: string;
    sent_to: string;
    status: string;
    nonce: number;
    fee: {
      fungible_info: FungibleInfo;
      quantity: {
        price: number;
        value: number;
      };
    };
    transfers: Array<{
      fungible_info: FungibleInfo;
      nft_info?: NFTInfo;
      direction: string;
      quantity: Quantity;
      value: number;
      price: number;
      sender: string;
      recipient: string;
    }>;
    approvals: Array<{
      fungible_info: FungibleInfo;
      nft_info?: NFTInfo;
      quantity: Quantity;
      sender: string;
    }>;
   
  };
  relationships: {
    chain: {
      links: {
        related: string;
      };
      data: {
        type: string;
        id: string;
      };
    };
  };
};

export type WalletTransactionsResponse = {
  links: {
    self: string;
    next: string;
  };
  data: WalletTransactionsData[];
};

export type ErrorResponse = {
  error: string;
};
