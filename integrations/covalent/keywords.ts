const keywords = ["balance", "balances", "wallet"];

export const match = (keyword: string) => {
  return keywords.some((k) => k === keyword);
}