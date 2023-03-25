import { BigNumber } from "ethers";
import { isAddress } from "ethers/lib/utils.js";

export const sanitizeAddress = (address: string) => {
  if (!address) return null;

  const normalizedAddress = address?.trim().toLowerCase();

  if (isAddress(normalizedAddress)) {
    return normalizedAddress as `0x${string}`;
  }

  return null;
};

export const sanitizeENS = (ensName: string) => {
  if (!ensName) return null;

  const normalizedENS = ensName?.trim().toLowerCase();

  if (normalizedENS.endsWith(".eth") && !normalizedENS.includes(" ")) {
    return normalizedENS;
  }

  return null;
};

export const sanitizeAmountBigNumber = (
  amount: string,
  decimals: number = 18
) => {
  if (!amount) return null;

  const normalizedAmount = String(amount)?.trim();

  if (normalizedAmount && !isNaN(Number(normalizedAmount))) {
    return BigNumber.from(normalizedAmount).mul(
      BigNumber.from(10).pow(decimals)
    );
  }

  return null;
};

export const sanitizeAmount = (amount: string) => {
  if (!amount) return null;

  const normalizedAmount = String(amount)?.trim();

  if (normalizedAmount && !isNaN(Number(normalizedAmount))) {
    return normalizedAmount;
  }

  return null;
};
