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
